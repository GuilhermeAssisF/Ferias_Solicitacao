var atividade;
$(document).ready(function () {

	var atividade = getAtividade();
	var funcaoSelecionada = $("#cpFuncao").val();

	window.loadingLayer = FLUIGC.loading(window);

	$("#blockChamadosAbertos").hide();
	//inicio, reabertura e ajuste
	if ((atividade == 0 || atividade == 1 || atividade == 9)) {

		criaDatepickers();
		bindEventos();
		naoImprimi13();
		criaDatepickersPagto();
		//$(".btnZoom").css('opacity', '0');

		$("#cpDataInicioFerias").blur(function () {
			veriDataCorreMarcada();
		});
	}

	if (atividade == 24) {
		$("#cpAprovarAssinatura").change(function () {
			$(".limpaAvaliacao").val('');
			var aprovado = $("#cpAprovarAssinatura").val() == '1';
			$(".blockAvaliacao").toggle(aprovado);
		});
	}
	if ($("#cpAtencao").val() != "") {
		$("#PeriodoVencido").show();
	} else {
		$("#PeriodoVencido").hide();
	}

	if (funcaoSelecionada) {
		estagiarioBloqueiaCampos(funcaoSelecionada);
		estagiarioOcultaCampos(funcaoSelecionada);
		controlaExibicaoTextoInformativo(funcaoSelecionada);
	}

	if ((atividade == 0 || atividade == 1 || atividade == 11 ||
		atividade == 16 || atividade == 20 || atividade == 24
		|| atividade == 26 || atividade == 60)) {

		$("#zoomSituacao").click(function () {
			FLUIG_0109.zoomHistsituacao();
		});
		$("#zoomFaltas").click(function () {
			FLUIG_0109.zoomHistFaltas();
		});
		$("#zoomAfastamento").click(function () {
			FLUIG_0109.zoomHistAfastamentos();
		});
		$("#zoomPeriodos").click(function () {
			FLUIG_0109.HistPeriodos();
		});

		$("#zoomLiqFerias").click(function () {
			FLUIG_0109.zoomLiquidFerias();
		});
	}
	//carrega o envelopa de ferias
	if (atividade == 20 || atividade == 24) {
		CarregaosLiquidodeFerias()
	}

	$("#cpHaveraAbono").change(function () {
		CalcFerias();
	});

	$("#tbItens").hide();
});

var FLUIG_0109 = {


	// Zoom SITUACAO
	zoomHistsituacao: function () {
		var zoomHistsituacao = ZoomFactory(ZoomConfigs.Histsituacao);
		zoomHistsituacao.Abrir();
	},
	// Zoom FALTAS
	zoomHistFaltas: function () {
		var zoomHistFaltas = ZoomFactory(ZoomConfigs.HistFaltas);
		zoomHistFaltas.Abrir();
	},
	// Zoom AFASTAMENTO
	zoomHistAfastamentos: function () {
		var HistAfastamentos = ZoomFactory(ZoomConfigs.HistAfastamentos);
		HistAfastamentos.Abrir();
	},
	// Zoom PERIODOS
	HistPeriodos: function () {
		var zoomHistPeriodos = ZoomFactory(ZoomConfigs.HistPeriodos);
		zoomHistPeriodos.Abrir();
	},
	// Zoom lIQUIDOfERIAS
	zoomLiquidFerias: function () {
		var zoomLiquidFerias = ZoomFactory(ZoomConfigs.LiquidFerias);
		zoomLiquidFerias.Abrir();
	}

}


var getFeriados = (function () {

	var cacheFeriados = null;

	var extractDadosFeriado = function (f) {
		return {
			dia: f.holidayDay,
			mes: f.holidayMonth,
			ano: f.holidayYear
		};
	};

	var carregaFeriados = function () {
		cacheFeriados = DatasetFactory.getDataset('globalCalendar').values.map(extractDadosFeriado);
		return cacheFeriados;
	};

	return function () {
		return cacheFeriados || carregaFeriados();
	};
})();

//CALCULA DATADE FIM DE FERIAS AUTOMATICAMENTE
function CalcFerias() {

	var Inicio = $("#cpDataInicioFerias").val();
	var DiasAbono = $("#cpDiasAbono").val();
	var DiasDireto = $("#cpDiasDireito").val();
	if (DiasAbono == "") {
		DiasAbono = "0";
	}

	if (Inicio != "") {

		var Data = Inicio;
		var diaData = Data.substring(0, 2);
		var mesData = Data.substring(3, 5);
		var anoData = Data.substring(6, 10);

		var dataInicio = new Date(mesData + "/" + diaData + "/" + anoData);
		var Fim = new Date(dataInicio.setDate(dataInicio.getDate() + (parseFloat(DiasDireto) - parseFloat(DiasAbono) - parseFloat(1))));

		var diaFim = Fim.getDate();
		var mesFim = Fim.getMonth() + 1;
		var anoFim = Fim.getFullYear();

		if (mesFim < 10) {
			mesFim = "0" + mesFim;
		} if (diaFim < 10) {
			diaFim = "0" + diaFim;
		}

		var DataFim = (diaFim + "/" + mesFim + "/" + anoFim);

		$("#cpDataFimFerias").val(DataFim);

		dataSelecionadaHandler();
		VerificaFimPEr();
	}
}




//CRIA DATEPICKERS

var carregaDataCorreta = function () {
	var hoje = new Date();
	var dataVenc = new Date(hoje.getTime() + (24 * 60 * 60 * 1000));
	//return dataVenc.getDate() + "/" + (dataVenc.getMonth() + 1) + "/" + dataVenc.getFullYear();
	$("#cpDataMin").val(dataVenc)
}

var veriDataCorreMarcada = function () {
	var Correta = $("#cpDataMin").val();
	var Marcada = $("#cpDataInicioFerias").val();

	var FerCorreta = Marcada.substring(3, 5) + '/' + Marcada.substring(0, 2) + '/' + Marcada.substring(6, 10);
	var date = new Date(FerCorreta);
	$("#cpDataPrazo").val(date);
	if (date < Correta) {
		$("#cpVerPrazos").val("1");
	} else {
		$("#cpVerPrazos").val("2");
	}
}

var criaDatepickers = function () {
	carregaDataCorreta();
	var minDateInicioFerias = new Date();
	//minDate.setDate(minDate.getDate() + 30); // Lógica original comentada ou ajustada
	minDateInicioFerias.setDate(minDateInicioFerias.getDate() - 60); // Mantendo a lógica original encontrada


	$("#cpDataInicioFerias").datepicker({
		showOn: "button",
		beforeShowDay: function (data) {
			// --- Sua lógica existente para desabilitar feriados/dias da semana ---
			// Esta parte permanece igual à sua função original
			var situacaoFunc = $("#cpSituacao").val(); // Pega a situação atual do colaborador
			if (situacaoFunc != "Licença Mater.") { // Ajuste para usar a variável correta

				// Sua lógica original para dias inválidos (ex: sábado/domingo ou qualquer outra)
				// Exemplo (desabilitar Sáb/Dom): var validWeekDay = data.getDay() != 0 && data.getDay() != 6;
				var validWeekDay = true; // Permite qualquer dia por padrão aqui, ajuste se necessário

				var feriados = getFeriados();

				var isFeriado = feriados.some(function (feriado) {
					var isDia = feriado.dia == data.getDate(),
						isMes = feriado.mes == data.getMonth() + 1,
						isAno = (feriado.ano == 0 || feriado.ano == data.getFullYear());
					return isDia && isMes && isAno;
				});

				var isValid = validWeekDay && !isFeriado;

				return [isValid, ''];
			} else {
				// Sua lógica original específica para Licença Maternidade, se houver
				var validWeekDay = data.getDay() != 0 && data.getDay() != 6;
				var feriados = getFeriados();

				var isFeriado = feriados.some(function (feriado) {
					var isDia = feriado.dia == data.getDate(),
						isMes = feriado.mes == data.getMonth() + 1,
						isAno = (feriado.ano == 0 || feriado.ano == data.getFullYear());
					return isDia && isMes && isAno;
				});

				var isValid = validWeekDay && !isFeriado;

				return [isValid, ''];
			}
			// --- Fim da lógica existente ---
		},
		onSelect: function (dateText, inst) {
			var dataInicioSelecionada = $(this).datepicker('getDate'); // Pega o objeto Date selecionado

			// --- Limpa Data de Pagamento antes de recalcular ---
			$("#cpDtPagto").val(''); // Limpa o valor selecionado anteriormente
			// --- Fim da limpeza ---

			$(document).trigger('dataInicioSelected', dateText); // Evento original
			$(document).trigger('dataSelecionada');             // Evento original
			CalcFerias(); // Função original

			// --- NOVA LÓGICA PARA ATUALIZAR cpDtPagto ---
			if (dataInicioSelecionada) {
				var maxPagamentoDate = new Date(dataInicioSelecionada.getTime());
				maxPagamentoDate.setDate(dataInicioSelecionada.getDate() - 3); // Calcula Data Início - 3 dias (pagar no máx. dia anterior ao limite)
				maxPagamentoDate.setHours(0, 0, 0, 0); // Zera horas para comparação

				var hoje = new Date();
				hoje.setHours(0, 0, 0, 0); // Zera horas para comparar apenas a data

				// Atualiza o datepicker da Data de Pagamento
				$("#cpDtPagto").datepicker("option", "minDate", hoje); // Garante que a data mínima é hoje
				$("#cpDtPagto").datepicker("option", "maxDate", maxPagamentoDate); // Define a data máxima permitida

				// Habilita o campo e o botão do datepicker de pagamento
				$("#cpDtPagto, #buscarDtPagto button").prop("disabled", false);

			} else {
				// Se a data de início for limpa, reseta o maxDate e desabilita
				$("#cpDtPagto").datepicker("option", "minDate", hoje); // Reseta minDate para hoje
				$("#cpDtPagto").datepicker("option", "maxDate", null); // Remove a restrição de data máxima
				$("#cpDtPagto").val(''); // Limpa o valor
				$("#cpDtPagto, #buscarDtPagto button").prop("disabled", true); // Desabilita novamente
			}
			// --- FIM DA NOVA LÓGICA ---

		},
		minDate: minDateInicioFerias // Usa a data mínima calculada para Início Férias

	});

	// DATA FIM - Mantém a lógica original
	$("#cpDataFimFerias").datepicker({
		showOn: "button",
		onSelect: function () {
			$(document).trigger('dataSelecionada');
		},
		minDate: minDateInicioFerias // Usa a mesma data mínima inicial que Início Férias
	});

	veriDataCorreMarcada(); // Função original
};

//**************************************************************

var bindEventos = function () {

	//SOLICITAÇÃO PARA ...
	$("#cpSolicitacaoPara").change(function () {
		selecionaColaborador(this.value);
	});

	$(document).on('departamentoSelecinado', function (ev, secao) {
		departamentoSelecinadoHandler(secao);

	}).on('colaboradorSelecionado', function (ev, colaborador, gestores) {
		colaboradorSelecionadoHandler(colaborador, gestores);

	}).on('dataInicioSelected', function (ev, data) {
		dataInicioSelectedHandler(data);

	}).on('dataSelecionada', function () {
		dataSelecionadaHandler();
	});

	//HAVERA ABONO
	$("#cpHaveraAbono").change(function () {
		var haveraAbono = this.value; // Pega o valor selecionado (1, 2 ou 3)

		if (haveraAbono == "3") { // Caso "Somente Abono"
			$(".hideAbonoOnly").hide(); // Esconde os campos específicos
			// Limpa os valores dos campos escondidos para evitar dados inconsistentes
			$("#cpDataInicioFerias, #cpDataFimFerias, #cpDiasFerias, #cpDiaSemana, #cpAntecipar13Salario").val('');
			$("#cpDiasAbono").val(''); // Limpa dias abono para preenchimento manual ou cálculo específico
			$("#cpDiasAbono").prop('readonly', false); // Permite editar dias de abono
			$("#cpDtPagto").prop('disabled', false).prop('readonly', false); // Garante que data de pagamento esteja visível/editável
			$("#buscarDtPagto button").prop("disabled", false); // Habilita botão do datepicker de pagamento
			// Opcional: Se quiser resetar o datepicker de pagamento para não ter maxDate
			var hoje = new Date();
			hoje.setHours(0, 0, 0, 0);
			$("#cpDtPagto").datepicker("option", "minDate", hoje);
			$("#cpDtPagto").datepicker("option", "maxDate", null);


		} else { // Caso "Sim" (1) ou "Não" (2)
			$(".hideAbonoOnly").show(); // Mostra os campos
			$("#cpDiasAbono").prop('readonly', true); // Volta a ser somente leitura (calculado)
			$("#cpDtPagto").prop('readonly', true); // Volta a ser somente leitura (depende da data início)


			// Aplica a lógica original para calcular dias de abono (se houver)
			var calcularAbono = (haveraAbono == "1");
			updateDiasAbono(calcularAbono); // Recalcula abono (vai zerar se for "Não")

			// Reabilita/Desabilita Data Pagamento com base na Data Início (se houver)
			var dataInicioSelecionada = $("#cpDataInicioFerias").datepicker('getDate');
			if (dataInicioSelecionada) {
				var maxPagamentoDate = new Date(dataInicioSelecionada.getTime());
				maxPagamentoDate.setDate(dataInicioSelecionada.getDate() - 3);
				maxPagamentoDate.setHours(0, 0, 0, 0);
				var hoje = new Date();
				hoje.setHours(0, 0, 0, 0);
				$("#cpDtPagto").datepicker("option", "minDate", hoje);
				$("#cpDtPagto").datepicker("option", "maxDate", maxPagamentoDate);
				$("#cpDtPagto, #buscarDtPagto button").prop("disabled", false);
			} else {
				$("#cpDtPagto, #buscarDtPagto button").prop("disabled", true);
				$("#cpDtPagto").val(''); // Limpa se não houver data de início
				$("#cpDtPagto").datepicker("option", "maxDate", null);
			}

		}
		// Recalcula as férias caso a opção não seja "Somente Abono" e haja data de início
		if (haveraAbono != "3" && $("#cpDataInicioFerias").val() != '') {
			CalcFerias();
		} else if (haveraAbono != "3") {
			// Se não for "Somente Abono" mas não tiver data de início, limpa data fim e dias
			$("#cpDataFimFerias, #cpDiasFerias").val('');
		}
	});

	//BUSCA DATA INICIO FERIAS
	$("#buscarDataInicioFerias").click(function () {
		$("#cpDataInicioFerias").datepicker('show');
	});

	//BUSCA DATA FIM FERIAS
	$("#buscarDataFimFerias").click(function () {
		$("#cpDataFimFerias").datepicker('show');
	});
	//BUSCA DATA DE PAGAMENTO
	$("#buscarDtPagto").click(function () {
		$("#cpDtPagto").datepicker('show');
	});

	//TOGGLE DO BOTAO DE TERMO
	$("#cpAntecipar13Salario").change(function () {
		toggleBotaoTermo13Salario(this.value);
	});

	//BOTAO PARA IMPRIMIR TERMO 13 SALARIO
	$("#botaoImprimirTermo").click(function () {
		validaCamposParaTermo();
	});

	//HAVERA SUBSTITUTO
	$("#cpHaveraSubstituto").change(function () {
		toggleSubstituto(this.value);
	});

	//BUSCA  COLABORADOR SUBSTITUTO
	$("#buscaColaboradorSubstituto").click(function () {
		buscaCentroCustoSubstituto();
	});

	$(document).on('departamentoSubstitutoSelected', function (ev, secao) {
		departamentoSubstitutoSelectedHandler(secao);

	}).on('colaboradorSubstitutoSelected', function (ev, colaborador) {
		colaboradorSubstitutoSelectedHandler(colaborador);
	});

	$("#buscaColaborador").click(function () {
		if (window.ultimaSecao) {
			$(document).trigger('departamentoSelecinado', window.ultimaSecao);
		} else {
			alert('Escolha uma seção!');
		}
	});

	$("#buscaSecao").click(function () {
		selecionaColaborador('2');
	});
};

//***************************************************************



var criaDatepickersPagto = function () {
	var hoje = new Date();
	hoje.setHours(0, 0, 0, 0); // Garante que a hora não interfira

	$("#cpDtPagto").datepicker({
		showOn: "button",
		showButtonPanel: true, // Mantido como estava
		changeMonth: true,     // Mantido como estava
		changeYear: true,      // Mantido como estava
		showOtherMonths: true, // Mantido como estava
		selectOtherMonths: true,// Mantido como estava
		onSelect: function () {
			// Pode adicionar lógica extra aqui se necessário ao selecionar a data de pagamento
			$(document).trigger('dataSelecionada'); // Mantém o gatilho original
		},
		minDate: hoje, // Data mínima é hoje
		maxDate: null // Inicialmente não há data máxima definida
	});

	// Desabilita o campo e o botão inicialmente, pois depende da Data de Início
	// Verifica se já existe uma Data de Início preenchida ao carregar a página
	if ($("#cpDataInicioFerias").val() == "") {
		$("#cpDtPagto, #buscarDtPagto button").prop("disabled", true);
	} else {
		// Se já houver data de início, força a atualização do maxDate e habilita
		var dataInicioInicial = $("#cpDataInicioFerias").datepicker('getDate');
		if (dataInicioInicial) {
			var maxPagamentoInicial = new Date(dataInicioInicial.getTime());
			maxPagamentoInicial.setDate(dataInicioInicial.getDate() - 3);
			maxPagamentoInicial.setHours(0, 0, 0, 0);
			$("#cpDtPagto").datepicker("option", "minDate", hoje);
			$("#cpDtPagto").datepicker("option", "maxDate", maxPagamentoInicial);
			$("#cpDtPagto, #buscarDtPagto button").prop("disabled", false);
		} else {
			// Caso a data inicial seja inválida por algum motivo, mantém desabilitado
			$("#cpDtPagto, #buscarDtPagto button").prop("disabled", true);
		}
	}
};


var selecionaColaborador = function (target) {

	switch (target) {
		// Proprio colaborador
		case '1':

			window.loadingLayer.show();

			setTimeout(function () {
				proprioColaborador();
			}, 100);


			$(".btnZoom").css('opacity', '0');
			break;

		// Outro Colaborador
		case '2':
			$(".btnZoom").css('opacity', '1');
			buscaCentroCusto();
			break;

		default:


	}

}

//PROPRIO COLABORADOR
var proprioColaborador = function () {
	var coligada = $("#cpSolicitanteColigada").val();
	var dadosProprio = getDadosSecaoSolicitante();

	var secaoGestores = getMapSecao(dadosProprio.dadosSecao);

	window.ultimaSecao = secaoGestores;

	var colaborador = getMapaColaborador(dadosProprio.dadosColaborador, coligada, secaoGestores);

	secaoGestores.pulaZoom = true;

	$(document).trigger('departamentoSelecinado', secaoGestores);
	$(document).trigger('colaboradorSelecionado', [colaborador, secaoGestores.gestores]);
}

//OUTRO COLABORADOR
var buscaColaborador = function (secao, coligada, gestores) {
	var zoomColaborador = criaZoomColaborador(secao, coligada);

	zoomColaborador.Retorno = function (retorno) {
		var colaborador = getMapaColaborador(retorno, coligada, gestores);
		$(document).trigger('colaboradorSelecionado', [colaborador, gestores]);
	};

	zoomColaborador.Abrir();
};

var criaZoomColaborador = function (codSecao, codColigada) {
	var zoomColaborador = new Zoom();

	zoomColaborador.FieldsName = ["codSecao", "codColigada"];
	zoomColaborador.Id = "IDZoomDadosColaborador";
	zoomColaborador.DataSet = "DS_FLUIG_0026";
	zoomColaborador.Titulo = "Buscar Colaborador";
	zoomColaborador.setRawFilters("codSecao", codSecao);
	zoomColaborador.setRawFilters("codColigada", codColigada);
	zoomColaborador.Colunas = [

		{ "title": "CODCOLIGADA", "name": "CODCOLIGADA" },
		{ "title": "CHAPA", "name": "CHAPA" },
		{ "title": "NOMEFANTASIA", "name": "NOMEFANTASIA", display: false },
		{ "title": "NOME", "name": "NOME" },
		{ "title": "CARGO", "name": "CARGO" },
		{ "title": "SECAO", "name": "SECAO" },
		{ "title": "UF_SECAO", "name": "UF_SECAO", display: false },
		{ "title": "SITUACAO", "name": "SITUACAO", display: false },
		{ "title": "CTPS", "name": "CTPS", display: false },
		{ "title": "DATANASCIMENTO", "name": "DATANASCIMENTO", display: false },
		{ "title": "DATAADMISSAO", "name": "DATAADMISSAO", display: false },
		{ "title": "IDADE", "name": "IDADE", display: false }
	];
	return zoomColaborador;
};

//BUSCA CENTRO DE CUSTO
var buscaCentroCusto = function () {

	var login = $("#cpLoginFluig").val();

	var zoomSecao = new Zoom();

	zoomSecao.FieldsName = ["login"];
	zoomSecao.Id = "IDZoomCentroCusto";
	zoomSecao.DataSet = "DS_FLUIG_0012";
	zoomSecao.Titulo = "Buscar Obra/Departamento";
	zoomSecao.setRawFilters("login", login);
	zoomSecao.Colunas = [

		{ "title": "Obra/Departamento", "name": "SECAO" },
		{ "title": "Cod.Secao", "name": "CODSECAO", "display": false },
		{ "title": "Cod.Coligada", "name": "CODCOLIGADA", "display": false },
		{ "title": "", "name": "COD_GESTOR", "display": false },
		{ "title": "", "name": "NOME_GESTOR", "display": false },
		{ "title": "", "name": "COD_DIRETOR", "display": false },
		{ "title": "", "name": "NOME_DIRETOR", "display": false },
		{ "title": "Empresa", "name": "EMPRESA", "display": false }
	];

	zoomSecao.Retorno = function (retorno) {
		var secao = getMapSecao(retorno);
		window.ultimaSecao = secao;
		$(document).trigger('departamentoSelecinado', secao);
	};

	zoomSecao.Abrir();
};

var montaDadosSolicitante = function () {
	return {
		nome: $("#cpNomeSolicitante").val(),
		chapa: $("#cpMatriculaSolicitante").val(),
		funcao: $("#cpFuncaoSolicitante").val(),
		admissao: $("#cpDtAdmissao").val(),
		coligada: $("#cpSolicitanteColigada").val(),
	};
};


var getDadosSecaoSolicitante = function () {

	var codpessoa = $("#cpLoginFluig").val();
	var coligada = $("#cpSolicitanteColigada").val();
	var funcao = $("#cpFuncaoSolicitante").val();
	var chapa = $("#cpMatriculaSolicitante").val();
	var datasetResult = DatasetFactory.getDataset("DS_FLUIG_0006", [codpessoa], null, null).values[0];

	return {
		dadosSecao: [
			datasetResult.SECAO,
			datasetResult.CODSECAO,
			datasetResult.CODCOLIGADA,
			datasetResult.COD_DIRETOR,
			datasetResult.NOME_DIRETOR,
			datasetResult.COD_GESTOR,
			datasetResult.NOME_GESTOR,
		],
		dadosColaborador: [
			coligada,
			chapa,
			datasetResult.NOMEFANTASIA,
			datasetResult.NOME,
			funcao,
			datasetResult.SECAO,
			datasetResult.UF_SECAO,
			datasetResult.SITUACAO,
			datasetResult.CTPS,
			datasetResult.DATANASCIMENTO,
			datasetResult.DATAADMISSAO,
			datasetResult.IDADE

		]
	};
};

var getMapaColaborador = function (retorno, coligada, gestores) {
	return {

		coligada: retorno[0],
		chapa: retorno[1],
		NOMEFANTASIA: retorno[2],
		nome: retorno[3],
		funcao: retorno[4],
		secao: retorno[5],
		UF_SECAO: retorno[6],
		SITUACAO: retorno[7],
		CTPS: retorno[8],
		DATANASCIMENTO: retorno[9],
		DATAADMISSAO: retorno[10],
		IDADE: retorno[11]

	};
};

var getMapSecao = function (retorno) {
	return {
		nome: retorno[0],
		codigo: retorno[1],
		coligada: retorno[2],
		empresa: retorno[11],
		gestores: {
			GESTOR: {
				chapa: retorno[3],
				nome: retorno[4]
			},
			DIRETOR: {
				chapa: retorno[5],
				nome: retorno[6]
			}
		}
	};
};

var SituacaoFun;
var preencheColaborador = function (colaborador) {
	$("#cpColaborador").val(colaborador.nome);
	$("#cpMatricula").val(colaborador.chapa);
	$("#cpFuncao").val(colaborador.funcao);
	$("#cpDataAdmissao").val(colaborador.DATAADMISSAO);
	$("#cpGerenteGeral").val(colaborador.COD_GESTOR);
	$("#cpSuperintendente").val(colaborador.COD_GESTOR);
	$("#cpDiretor").val(colaborador.COD_DIRETOR);
	$("#cpDtNascimento").val(colaborador.DATANASCIMENTO);
	$("#cpSituacao").val(colaborador.SITUACAO);
	$("#cpIdade").val(colaborador.IDADE);
	$("#cpCTPS").val(colaborador.CTPS);
	$("#cpEmpresa").val(colaborador.NOMEFANTASIA),
		$("#cpFimContrato").val(colaborador.FIMPRAZOCONTR)
	SituacaoFun = colaborador.SITUACAO;
	console.log(SituacaoFun);

	/*if(atividade=="1"|| atividade=="0"){
	verificaDesligamentos();
	}
	$("#cpPrazoGravida").val("");
	PrazoGravida();*/
};

var carregaFimContrato = function (chapa, coligada, funcao) {
	if (isEstagiario(funcao)) {
		var contrato = getFimContrato(chapa, coligada);

		var fimPrazoContrato = sqlDateToStr(contrato.FIMPRAZOCONTR);
		$("#cpFimContrato").val(fimPrazoContrato);
	}
}

var getFimContrato = function (chapa, coligada) {
	var datasetResult = DatasetFactory.getDataset("DS_FLUIG_0003", [chapa + '', coligada + '']);
	return datasetResult.values[0];
}

var colaboradorSelecionadoHandler = function (colaborador, gestores) {
	limpaCamposPosColab();

	preencheColaborador(colaborador);
	preencheGestorImediato(colaborador, gestores);
	carregaPeriodoAquisitivo(colaborador.chapa, colaborador.coligada, colaborador.funcao);


	carregaFimContrato(colaborador.chapa, colaborador.coligada, colaborador.funcao);
	updatePickers(colaborador.funcao);
	estagiarioBloqueiaCampos(colaborador.funcao);
	estagiarioOcultaCampos(colaborador.funcao);
	controlaExibicaoTextoInformativo(colaborador.funcao);
	desabilitaHabono();

	setTimeout(function () {
		window.loadingLayer.hide();
	}, 100);

};

//BUSCA GESTOR IMEDIATO DO COLABORADOR SELECIONADO
var getSuperiorImediato = function (gestores, solicitante) {

	solicitante = solicitante + '';

	var listaGestores = [gestores.GESTOR.chapa + '', gestores.DIRETOR.chapa + ''];
	var posicaoSolicitante = listaGestores.indexOf(solicitante);

	var existeGerenteGeral = listaGestores[2] != '';
	var existeSuperintendente = listaGestores[1] != '';

	var solicitanteSuperintendente = posicaoSolicitante == 1;
	var gerenteGeralSemSuperintendente = posicaoSolicitante == 2 && !existeSuperintendente;
	var gestorSemGerenteGeralSemSuperintendente = posicaoSolicitante == 3 && !existeSuperintendente && !existeGerenteGeral;

	var solicitanteGerenteGeral = posicaoSolicitante == 2;
	var solicitanteGestorSemGerenteGeral = posicaoSolicitante == 3 && !existeGerenteGeral;

	if (posicaoSolicitante == -1) {
		return gestores.gestor;
	}
	//Diretor
	if (posicaoSolicitante == 0) {
		return false;
	}

	if (solicitanteSuperintendente || gerenteGeralSemSuperintendente || gestorSemGerenteGeralSemSuperintendente) {
		return gestores.diretor;
	}

	if (solicitanteGerenteGeral || solicitanteGestorSemGerenteGeral) {
		return gestores.superintendente;
	}

	return gestores.gerenteGeral;
};

//RETORNA GESTOR IMEDIATO
var preencheGestorImediato = function (colaborador, gestores) {

	$("#cpGestorImediato").val(gestores.GESTOR.nome);
	$("#cpChapaGestor").val(gestores.GESTOR.chapa);

};

//***************************************************************

//VERIFICA SE CARGO E ESTAGIARIO

var isEstagiario = function (funcao) {
	return funcao.search('ESTAGIARIO') > -1;
};

var estagiarioBloqueiaCampos = function (funcao) {
	$("#opcaoSimHaveraAbono, #opcaoSim13Salario").prop('disabled', isEstagiario(funcao));
};

var estagiarioOcultaCampos = function (funcao) {
	var estagiario = isEstagiario(funcao);
	$("#fimContrato").toggle(estagiario);
	$(".ocultaCampo").toggle(!estagiario);
};

var controlaExibicaoTextoInformativo = function (funcao) {
	escondeTextoAvisoEstagiario();
	mostraTextoAvisoColaborador();

	if (isEstagiario(funcao)) {
		mostraTextoAvisoEstagiario();
		escondeTextoAvisoColaborador();
	}
};

//***************************************************************

var dataSelecionadaHandler = function () {
	var diasFerias = getDiasFerias();
	diasFerias = diasFerias || 0;
	$("#cpDiasFerias").val(diasFerias);

	carregaLimitedeFerias();
};

var getDiasFerias = function () {
	var inicio = getInicioFerias();
	var fim = getFimFerias();


	var ONE_DAY = 1000 * 60 * 60 * 24

	var date1_ms = inicio.getTime()
	var date2_ms = fim.getTime()

	if (date1_ms < date2_ms) {

		var difference_ms = Math.abs((date2_ms - date1_ms) + ONE_DAY)
		return Math.round(difference_ms / ONE_DAY)
	} else {
		return 0;
	}

};
function carregaLimitedeFerias() {

	var FimPerAqui = $("#cpFimPeriodoAquisitivo").val();
	var dia = FimPerAqui.substring(0, 2);
	var mes = FimPerAqui.substring(3, 5);
	var ano = FimPerAqui.substring(6, 10);

	var fimPer = new Date(ano + '/' + mes + '/' + dia);
	var Fim = new Date(fimPer.setMonth(fimPer.getMonth() + 11));
	//fim periodo aquisitivo adicionado de 11 dias, para verificar limite de ferias


	var IniFerias = $("#cpDataInicioFerias").val();
	var diaIni = IniFerias.substring(0, 2);
	var mesIni = IniFerias.substring(3, 5);
	var anoIni = IniFerias.substring(6, 10);

	var fimF = new Date(anoIni + '/' + mesIni + '/' + diaIni);
	//fim das férias selecionadas
	if (Fim != "" && fimF != "") {
		if (fimF > Fim) {
			$("#exibeLimiteInfIniciofer").show();
		} else {
			$("#exibeLimiteInfIniciofer").hide();
		}
	} else {
		$("#exibeLimiteInfIniciofer").hide();
	}

}
var dataInicioSelectedHandler = function (dataSelecionada) {
	var funcao = $("#cpFuncao").val();

	clearCamposPosDataInicio();
	escondeBotaoTermo13Salario();
	toggleAntecipacao(checkAntecipacao(dataSelecionada));
	updateDiaSemada(dataSelecionada);

	if (isEstagiario(funcao)) updateDiasDireito();

	toggleAvisoDiaDaSemana();
};

var updateDiasDireito = function () {
	var diasDireito = getDiasDireitoEstagiario();
	$("#cpDiasDireito").val(diasDireito);
};

var getDiasDireitoEstagiario = function () {
	var inicioPeriodo = getInicioPeriodoAquisitivo();
	var inicioFerias = getInicioFerias();
	var mesesDecorridos = calcMesesDecorridos(inicioPeriodo, inicioFerias);

	if (mesesDecorridos > 11) return 30;
	if (mesesDecorridos > 5) return 15;
	return 0;
};

var calcMesesDecorridos = function (inicioPeriodo, inicioFerias) {
	var mesesDecorridos = 0;

	while (inicioPeriodo <= inicioFerias) {
		mesesDecorridos += 1;
		inicioPeriodo.setMonth(inicioPeriodo.getMonth() + 1);
	}

	return mesesDecorridos;
};

var updateDiasAbono = function (haveraAbono) {
	var diasDireito = $("#cpDiasDireito").val();
	var diasAbono = haveraAbono ? calcDiasAbono(parseInt(diasDireito)) : 0;
	diasAbono = diasAbono || 0;
	$("#cpDiasAbono").val(diasAbono);
};


var calcDiasAbono = function (diasDireito) {
	return Math.floor(diasDireito / 3);
};

var updatePickers = function (funcao) {
	var PrazoGravida = $("#cpPrazoGravida").val();
	if (PrazoGravida != "") {
		var dia = PrazoGravida.substring(0, 2);
		var mes = PrazoGravida.substring(3, 5);
		var ano = PrazoGravida.substring(6, 10);
		var Data = new Date(mes + "/" + dia + "/" + ano)

		var prazoMin = isEstagiario(funcao) ? 20 : 0;
		var minDate = getMinDate(prazoMin, funcao);
		//fim do afast de gravidez maior que data fim do periodo set ele como minDate
		if (Data > minDate) {
			$("#cpDataInicioFerias, #cpDataFimFerias").datepicker("option", "minDate", Data);
			//se for menor ou igual set o minDate de 45 dias
		} else {
			$("#cpDataInicioFerias, #cpDataFimFerias").datepicker("option", "minDate", minDate);
		}
		//se não existir esse prazo, fica com o prazo anterior
	} else {

		var prazoMin = isEstagiario(funcao) ? 20 : 0;
		var minDate = getMinDate(prazoMin, funcao);
		$("#cpDataInicioFerias, #cpDataFimFerias").datepicker("option", "minDate", minDate);


	}
};

var getMinDate = function (prazo, funcao) {

	var minDate = new Date();
	minDate.setDate(minDate.getDate() + prazo);

	if (!isEstagiario(funcao)) {
		var dtFimPeriodo = getFimPeriodoAquisitivo();
		if (dtFimPeriodo > minDate) {
			minDate = dtFimPeriodo;
		}
	}

	return minDate;
};


var getFimPeriodoAquisitivo = function () {
	return getDataConvertida('cpFimPeriodoAquisitivo');
};

var getInicioPeriodoAquisitivo = function () {
	return getDataConvertida('cpInicioPeriodoAquisitivo');
};

var getInicioFerias = function () {
	return getDataConvertida('cpDataInicioFerias');
};

var getFimFerias = function () {
	return getDataConvertida('cpDataFimFerias');
};

var getDataConvertida = function (campo) {
	var inicioPeriodo = $("#" + campo).val();
	return dateStrToDate(inicioPeriodo);
};

var departamentoSelecinadoHandler = function (secao) {

	limpaPosSelecaoCentroCusto();
	escondeBotaoTermo13Salario();

	$("#cpColigada").val(secao.coligada);
	$("#cpCentroCusto").val(secao.nome);
	$("#cpEmpresa").val(secao.empresa);

	if (!secao.pulaZoom) {
		buscaColaborador(secao.codigo, secao.coligada, secao.gestores);
	}
};


var cached_getPeriodoAtivo = (function () {
	var cache = {};
	return function (chapa, coligada) {
		var key = chapa + '_' + coligada,
			safeChapa = chapa + '',
			safeColigada = coligada + '';
		return cache[key] || (cache[key] = DatasetFactory.getDataset('DS_FLUIG_DATASERVER_0002', [safeChapa, safeColigada], null, null).values[0]);
	};
})();


var cached_getFeriasMarcada = (function () {
	var cache = {};
	return function (chapa, coligada, fimPeriodoAquisitivo) {
		var key = chapa + '_' + coligada + '_' + fimPeriodoAquisitivo,
			safeChapa = chapa + '',
			safeColigada = coligada + '';
		return cache[key] || (cache[key] = DatasetFactory.getDataset('DS_FLUIG_DATASERVER_0003', [safeChapa, safeColigada, fimPeriodoAquisitivo], null, null).values);
	};
})();

//BUSCA PERIODO AQUISITIVO
var carregaPeriodoAquisitivo = function (chapa, coligada, funcao) {

	var periodoAtivo = cached_getPeriodoAtivo(chapa, coligada);

	var feriasMarcadas = cached_getFeriasMarcada(chapa, coligada, periodoAtivo.FIMPERAQUIS.slice(0, 10));

	limpaDadosFeriasMarcadas();

	var detalhesPeriodoAtivo = cached_getDetalhesPeriodoAtivo(periodoAtivo.CHAPA, periodoAtivo.CODCOLIGADA, periodoAtivo.FIMPERAQUIS.slice(0, 10));

	var dtBase = new Date();

	if (!isEstagiario(funcao) && isPrimeiroAno(dtBase, detalhesPeriodoAtivo)) {
		detalhesPeriodoAtivo.DIASAMARCAR = 30;
		detalhesPeriodoAtivo.FALTAS = 0;
	}

	if (feriasMarcadas.length == 0) { //NAO POSSUI FERIAS MARCADAS
		carregaPeriodoDisponivel(detalhesPeriodoAtivo);
		escondeFeriasMarcadas();
		mostraDadosDasFerias()


	} else { //POSSUI FERIAS MARCADAS
		preencheDadosFeriasMarcadas(periodoAtivo, feriasMarcadas, detalhesPeriodoAtivo);
		mostraFeriasMarcadas();
		escondeDadosDasFerias();
	}
};

var isPrimeiroAno = function (dtBase, periodo) {
	var inicio = sqlStrDateToDate(periodo.INICIOPERAQUIS),
		fim = sqlStrDateToDate(periodo.FIMPERAQUIS);

	inicio.setHours(0);
	fim.setHours(0);

	return dtBase >= inicio && dtBase < fim;
}


var cached_getDetalhesPeriodoAtivo = (function () {
	var cache = {};
	return function (chapa, coligada, fimPeriodoAquisitivo) {
		var key = chapa + '_' + coligada + '_' + fimPeriodoAquisitivo,
			safeChapa = chapa + '',
			safeColigada = coligada + '';
		return cache[key] || (cache[key] = DatasetFactory.getDataset('DS_FLUIG_DATASERVER_0001', [safeChapa, safeColigada, fimPeriodoAquisitivo], null, null).values[0]);
	};
})();


var carregaPeriodoDisponivel = function (detalhesPeriodoAtivo) {
	$("#cpSituacaoFerias").val('Não possuí férias marcadas');
	$("#cpNumeroFaltas").val(detalhesPeriodoAtivo.FALTAS);
	$("#cpDiasDireito").val(parseInt(detalhesPeriodoAtivo.DIASAMARCAR));
	$("#cpInicioPeriodoAquisitivo").val(sqlDateToStr(detalhesPeriodoAtivo.INICIOPERAQUIS));
	$("#cpFimPeriodoAquisitivo").val(sqlDateToStr(detalhesPeriodoAtivo.FIMPERAQUIS));
	$("#cpfimfperAquiData").val(detalhesPeriodoAtivo.FIMPERAQUIS);

	//conta os 365 par o proximo periodo aquisitivo
	var fim = new Date($("#cpfimfperAquiData").val());
	//fim.setYear(fim.getFullYear()+1)
	fim.setDate(fim.getDate() + 366)
	$("#cpfimfperAquiData").val(fim);
};


var desabilitaHabono = function () {

	var diasDireito = parseInt($("#cpDiasDireito").val());
	abonoPermiteEditar();
	if (diasDireito < 15) {
		abonoSomenteLeitura();
	}
}


//FERIAS MARCADAS
var preencheDadosFeriasMarcadas = function (periodo, ferias, detalhes) {

	var feriasMarcada = ferias[0];

	$("#cpNumeroFaltas").val(detalhes.FALTAS);
	$("#cpSituacaoFerias").val('Possuí férias marcadas');
	$("#cpInicioPeriodoAquisitivo").val(sqlDateToStr(periodo.INICIOPERAQUIS));
	$("#cpFimPeriodoAquisitivo").val(sqlDateToStr(periodo.FIMPERAQUIS));
	$("#dataInicioFeriasMarcadas").html(sqlDateToStr(feriasMarcada.DATAINICIO));
	$("#dataFimFeriasMarcadas").html(sqlDateToStr(feriasMarcada.DATAFIM));
	$("#dtPagFeriasMarcadas").html(sqlDateToStr(feriasMarcada.DATAPAGTO));
	$("#diasFeriasMarcadas").html(feriasMarcada.NRODIASFERIAS);
	$("#diasAbonoFeriasMarcadas").html(feriasMarcada.NRODIASABONO || 0);


}


var sqlDateToStr = function (sqlDate) {
	var dtArr = sqlDate.substring(0, 10).split('-');
	return [dtArr[2], dtArr[1], dtArr[0]].join('/');
};


var sqlStrDateToDate = function (dateStr) {
	return new Date(dateStr.replace('T0', 'T1'));
};


var dateStrToDate = function (dateStr) {

	var dateArr = dateStr;

	var dia = dateArr.substring(0, 2);
	var mes = dateArr.substring(3, 5);
	var ano = dateArr.substring(6, 10);
	return new Date(mes + '/' + dia + '/' + ano);

};

//**************************************************************
//DIA DA SEMANA

var updateDiaSemada = function (dataSelecionada) {
	var diaSemana = getDiaSemana(dateStrToDate(dataSelecionada));
	$("#cpDiaSemana").val(diaSemana);
	toggleAvisoDiaDaSemana();
};

var getDiaSemana = function (data) {
	var diasSemana = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
	return diasSemana[data.getDay()];
};

//***************************************************************
//13 SALARIO

var checkAntecipacao = function (dataSelecionada) {
	var data = dateStrToDate(dataSelecionada);
	return data.getMonth() != 0 && data.getMonth() != 11 && data.getMonth() != 10;
};

var toggleAntecipacao = function (podeAntecipar) {

	var opcao13Salario = $("#opcaoSim13Salario");

	if (podeAntecipar) {
		opcao13Salario.prop('disabled', false);

	} else {
		opcao13Salario.prop('disabled', true);
	}
};

var naoImprimi13 = function () {
	$("#cp13SalarioImprimir").val('N');
}



var toggleBotaoTermo13Salario = function (desejaAntecipar) {

	if (!desejaAntecipar) {
		desejaAntecipar = $("#cpAntecipar13Salario").val();
	}

	if (desejaAntecipar == 1) {
		$("#botaoImprimirTermo").show();
	} else {
		escondeBotaoTermo13Salario();
	}
};

var escondeBotaoTermo13Salario = function () {
	$("#botaoImprimirTermo").hide();
};

var escondeFimContrato = function () {
	$("#fimContrato").hide();
}

var escondeFeriasMarcadas = function () {
	$("#blockPossuiFeriasMarcadas").hide();
};


var mostraFeriasMarcadas = function () {
	$("#blockPossuiFeriasMarcadas").show();
};

var escondeDadosDasFerias = function () {
	$("#blockDadosDasFerias").hide();
};

var mostraDadosDasFerias = function () {
	$("#blockDadosDasFerias").show();
};

var escondeTextoAvisoEstagiario = function () {
	$("#exibeTextoEstagiario").hide();
};

var mostraTextoAvisoEstagiario = function () {
	$("#exibeTextoEstagiario").show();
};

var escondeTextoAvisoColaborador = function () {
	$("#exibeTextoColaborador").hide();
};

var mostraTextoAvisoColaborador = function () {
	$("#exibeTextoColaborador").show();
};

var abonoSomenteLeitura = function () {
	$("#cpHaveraAbono").val('2');
	$("#cpDiasAbono").val('0');
	$("#cpHaveraAbono").prop('disabled', true);
};

var abonoPermiteEditar = function () {
	$("#cpHaveraAbono").val('');
	$("#cpHaveraAbono").prop('disabled', false);
};

var getDadosTermo = function () {

	var hoje = new Date();

	var d = hoje.getDate();

	return {
		empresa: $("#cpEmpresa").val(),
		centroCusto: $("#cpCentroCusto").val(),
		colaborador: $("#cpColaborador").val(),
		matricula: $("#cpMatricula").val(),
		funcao: $("#cpFuncao").val(),
		inicoFerias: $("#cpDataInicioFerias").val(),
		fimFerias: $("#cpDataFimFerias").val(),
		dia: d,
		mes: getMesNome(hoje.getMonth()),
		ano: hoje.getFullYear(),
		inicioPeriodo: $("#cpInicioPeriodoAquisitivo").val(),
		fimPeriodo: $("#cpFimPeriodoAquisitivo").val(),
		cpColaborador: $("#cpColaborador").val(),
		cpGestorImediato: $("#cpGestorImediato").val(),
	};

};

var getMesNome = function (mes) {
	var nomeMes = ["Janeiro",
		"Fevereiro",
		"Março",
		"Abril",
		"Maio",
		"Junho",
		"Julho",
		"Agosto",
		"Setembro",
		"Outubro",
		"Novembro",
		"Dezembro"];

	return nomeMes[mes];
};

var imprimeTermo = function () {
	var dadosTermo = getDadosTermo();
	$.get('Termo.html', function (template) {
		var termo = window.open('', '');
		termo.document.write(Mustache.render(template, dadosTermo));
		termo.focus();
	});
};

var validaCamposParaTermo = function () {

	var empresa = $("#cpEmpresa").val(),
		centroCusto = $("#cpCentroCusto").val(),
		colaborador = $("#cpColaborador").val(),
		matricula = $("#cpMatricula").val(),
		funcao = $("#cpFuncao").val(),
		inicoFerias = $("#cpDataInicioFerias").val(),
		fimFerias = $("#cpDataFimFerias").val();

	if ((empresa && centroCusto && colaborador && matricula && funcao && inicoFerias && fimFerias) == "") {
		$("#cp13SalarioImprimir").val('N');
		alert("Campos necessários para gerar termo estão vazios.");

	} else {
		$("#cp13SalarioImprimir").val('S');
		imprimeTermo();
	}
};

//***************************************************************
//COLABROADOR SUBSTITUTO

//BUSCA CENTRO DE CUSTO SUBSTITUTO
var buscaCentroCustoSubstituto = function () {

	var zoomSecaoSubstituto = new Zoom();

	zoomSecaoSubstituto.FieldsName = [];
	zoomSecaoSubstituto.Id = "IDZoomCentroCustoSubstituto";
	zoomSecaoSubstituto.DataSet = "DS_FLUIG_0006";
	zoomSecaoSubstituto.Titulo = "Buscar Obra/Departamento";

	zoomSecaoSubstituto.Colunas = [
		{ "title": "Obra/Departamento", "name": "SECAO" },
		{ "title": "Cod. Seção", "name": "CODSECAO", "display": false },
		{ "title": "Cod. Coligada", "name": "CODCOLIGADA", "display": false },
	];

	zoomSecaoSubstituto.Retorno = function (retorno) {

		var secao = {
			nome: retorno[0],
			codSecao: retorno[1],
			codColigada: retorno[2],
		};

		$(document).trigger('departamentoSubstitutoSelected', secao);
	};

	zoomSecaoSubstituto.Abrir();
};

var buscaColaboradorSubstituto = function (secao, coligada) {
	var zoomSubs = criaZoomColaborador(secao, coligada);

	zoomSubs.Retorno = function (retorno) {
		var subs = {
			nome: retorno[0],
			matricula: retorno[1]
		};

		$(document).trigger('colaboradorSubstitutoSelected', subs);
	};

	zoomSubs.Abrir();
};

var departamentoSubstitutoSelectedHandler = function (secao) {
	$("#cpCentroCustoSubstituto").val(secao.nome);
	buscaColaboradorSubstituto(secao.codSecao, secao.codColigada);
};

var colaboradorSubstitutoSelectedHandler = function (colaborador) {
	$("#cpColaboradorSubstituto").val(colaborador.nome);
	$("#cpMatriculaSubstituto").val(colaborador.matricula);
};
//***************************************************************

//LIMPA CAMPOS

//LIMPA CAMPOS NOME E CHAPA GESTOR IMEDIATO
var limpaGestorImediato = function () {
	$(".clearGestorImediato").val('');
};

//LIMPA CAMPOS APOS SELECIONAR CENTRO DE CUSTO
var limpaPosSelecaoCentroCusto = function () {
	$(".clearPosCentroCusto").val('');
};

//LIMPA DADOS DAS FERIS MARCADAS
var limpaDadosFeriasMarcadas = function () {
	$(".clearDadosFeriasMarcadas").html('');
};

//LIMPA CAMPOS DO FORMULARIO APOS SELECAO DE COLABORADOR
var limpaCamposPosColab = function () {
	$(".clearCampos").val("");
};

var clearCamposPosDataInicio = function () {
	$(".clearPosDataInicio").not('#cpDtPagto').val("");
};


//DATA SET PARA RETORNAR OS DADOS DOS LIQUIDO DE FERIAS

function CarregaosLiquidodeFerias() {

	var CHAPA = $("#cpColigada").val();
	var COLIGADA = $("#cpMatricula").val();
	var FIMPERAQUIS = $("#cpFimPeriodoAquisitivo").val();

	var fields = new Array(CHAPA, COLIGADA, FIMPERAQUIS);

	var EVENTO = 0;
	var TIPO_EVENTO = 0;
	var QUANTIDADE = 0;
	var VALOR = 0;
	var DATA_PAGTO = 0;
	var LIQUIDO_FERIAS = 0;
	var PROVENTO = 0;
	var DESCONTO = 0;
	var CARTAOUNIK = 0;


	try {

		var tabela = DatasetFactory.getDataset("DS_FLUIG_0145", fields, null, null);


		for (var i = 0; i < tabela.values.length; i++) {

			var indexRCM = wdkAddChild("tbItens");

			//aviso das regras de RG
			FLUIGC.popover('.bs-docs-popover-hover', { trigger: 'hover', placement: 'auto' });


			EVENTO = tabela.values[i].EVENTO.toString();
			TIPO_EVENTO = tabela.values[i].TIPO_EVENTO.toString();
			QUANTIDADE = tabela.values[i].QUANTIDADE.toString();
			VALOR = tabela.values[i].VALOR.toString();
			DATA_PAGTO = tabela.values[i].DATA_PAGTO.toString();
			LIQUIDO_FERIAS = tabela.values[i].LIQUIDO_FERIAS.toString();
			PROVENTO = tabela.values[i].PROVENTO.toString();
			DESCONTO = tabela.values[i].DESCONTO.toString();
			DESCONTO = tabela.values[i].DESCONTO.toString();
			CARTAOUNIK = tabela.values[i].CARTAOUNIK.toString();

			$("#EVENTO___" + indexRCM).val(EVENTO);
			$("#TIPO_EVENTO___" + indexRCM).val(TIPO_EVENTO);
			$("#QUANTIDADE___" + indexRCM).val(QUANTIDADE);
			$("#DATA_PAGTO___" + indexRCM).val(DATA_PAGTO);
			if (TIPO_EVENTO == "PROVENTO") {
				$("#PROVENTO___" + indexRCM).val(VALOR);
			} else {
				$("#DESCONTO___" + indexRCM).val(VALOR);
			}
			$("#LIQUIDOFERIAS").val(LIQUIDO_FERIAS);
			$("#VlrPROVENTO").val(PROVENTO);
			$("#VlrDESCONTO").val(DESCONTO);
			$("#CARTAOUNIK").val(CARTAOUNIK);
			$("#cpQtdFilhos").val(indexRCM);




		}
		$("#tbItens").hide();
		VLRMONETARIOPOREXTENSO();
	}

	catch (erro) {
		window.alert(erro);
	}

	//return valor;
	return 0;

}

//VALOR MONETARIO POR EXTENSO

function VLRMONETARIOPOREXTENSO() {

	var VALOR = $("#LIQUIDOFERIAS").val();

	var fields = new Array(VALOR);

	var VALOR_EXTENSO = 0;

	try {

		var tabela = DatasetFactory.getDataset("DS_FLUIG_0147", fields, null, null);


		for (var i = 0; i < tabela.values.length; i++) {

			VALOR_EXTENSO = tabela.values[i].VALOR_EXTENSO.toString();

			$("#cpVlrExtenso").val(VALOR_EXTENSO);
		}
	}

	catch (erro) {
		window.alert(erro);
	}

	//return valor;
	return 0;

}

function verificaDesligamentos() {
	$("#cpJaTemFerias").val("");
	var chapaDesligado = $("#cpMatricula").val(),
		nomeDesligado = $("#cpColaborador").val(),
		chamados = this.buscaDesligamentos(chapaDesligado, nomeDesligado);

	this.resetChamadosAbertos();

	if (chamados.length > 0) {

		chamados = this.filtraChamadosAbertos(chamados);

		if (chamados.length > 0) {
			$("#cpJaTemFerias").val(1);
			$("#blockColaborador").addClass('alert alert-danger');
			$("#blockChamadosAbertos").show();

			chamados = this.filtraChamadosAbertos(chamados);
			this.mostraChamadosAbertos(chamados);
		}
	}
};

function filtraChamadosAbertos(chamados) {

	var filtros = chamados.map(function (chamado) {
		return DatasetFactory.createConstraint("workflowProcessPK.processInstanceId", chamado + '', chamado + '', ConstraintType.SHOULD);
	});

	var datasetResult = DatasetFactory.getDataset('workflowProcess', null, filtros, null);
	if (datasetResult == "undefined" || datasetResult == undefined || datasetResult == "" || datasetResult == null || datasetResult.values == undefined) {
		return 0;
	} else {
		chamados = datasetResult.values.filter(function (chamado) {
			return chamado.active;

		}).map(function (chamado) {
			return chamado['workflowProcessPK.processInstanceId'];
		});

		return chamados;
	}
};

function resetChamadosAbertos() {
	$("#listaChamados").html('');
	$("#cpJaDesligado").val(0);
	$("#blockColaborador").removeClass('alert alert-danger');
	$("#blockChamadosAbertos").hide();
};

function mostraChamadosAbertos(chamados) {
	var urlBase = window.location.protocol + '//' + window.location.host + "/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=";
	var listaChamados = $("#listaChamados");

	var strToAppend = chamados.reduce(function (str, chamado) {
		if (str != '') {
			str += ', ';
		}

		return str + '<a target="_blank" href="' + urlBase + chamado + '">' + chamado + '</a>';
	}, '');

	listaChamados.append(strToAppend);
};

function buscaDesligamentos(matricula, nome) {
	var c1 = DatasetFactory.createConstraint("cpMatricula", matricula + '', matricula + '', ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("cpColaborador", nome, nome, ConstraintType.MUST);
	var datasetReturn = DatasetFactory.getDataset('FLUIG_0001', ['cpNumeroSolicitacao'], [c1, c2], null);
	var chamados = datasetReturn.values.map(function (chamado) {
		return chamado.cpNumeroSolicitacao;
	});

	return chamados;
};


function PrazoGravida() {

	var CHAPA = $("#cpMatricula").val();
	var COLIGADA = $("#cpColigada").val();


	var fields = new Array(CHAPA, COLIGADA);

	var DATA_PRAZO_GESTANTE = 0;

	try {

		var tabela = DatasetFactory.getDataset("DS_FLUIG_0152", fields, null, null);


		for (var i = 0; i < tabela.values.length; i++) {


			DATA_PRAZO_GESTANTE = tabela.values[i].DATA_PRAZO_GESTANTE.toString();



			$("#cpPrazoGravida").val(DATA_PRAZO_GESTANTE);

		}
	}

	catch (erro) {
		window.alert(erro);
	}

	//return valor;
	return 0;

}
function VerificaFimPEr() {
	var cpfimfperAquiData = $("#cpfimfperAquiData").val();
	var FimFerias = $("#cpDataFimFerias").val();
	var Data = FimFerias;
	var diaData = Data.substring(0, 2);
	var mesData = Data.substring(3, 5);
	var anoData = Data.substring(6, 10);

	cpfimfperAquiData = new Date(cpfimfperAquiData);

	var mesprox = cpfimfperAquiData.getMonth();
	var diaprox = cpfimfperAquiData.getDate();
	mesprox = parseFloat(mesprox) + parseFloat(1);
	var DataFinaldoprox = diaprox + "/" + mesprox + "/" + cpfimfperAquiData.getFullYear();

	var datafim = new Date(mesData + "/" + diaData + "/" + anoData);

	if (new Date(datafim) > new Date(cpfimfperAquiData)) {
		window.parent.FLUIGC.message.alert({
			message: "Aviso de férias em dobro: a data final das férias não pode ser superior ao início do próximo período aquisitivo " + DataFinaldoprox + ". Com exceção de período vencido por motivo de afastamento, licença maternidade e reintegração!",
			title: 'Erro',
			label: 'Ok'
		});
		$("#cpAtencao").val("Aviso de férias em dobro: a data final das férias não pode ser superior ao início do próximo período aquisitivo " + DataFinaldoprox + ". Com exceção de período vencido por motivo de afastamento, licença maternidade e reintegração!");
		$("#PeriodoVencido").show();
	} else {
		$("#cpAtencao").val("");
		$("#PeriodoVencido").hide();
	}
}