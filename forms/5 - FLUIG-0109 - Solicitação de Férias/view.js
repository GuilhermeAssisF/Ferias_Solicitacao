$(document).ready(function() {
	
	var atividade = getAtividade();

	//Compartilhados.carregaDescricaoProcesso(getCodProcess());
	Compartilhados.expandePainel(atividade);
	Compartilhados.destacaAprovacoes();
	Compartilhados.destacaParecer();
	Compartilhados.camposObrigatorio();
	//Compartilhados.carregaManual(getCodProcess(), "ID_LINK_MANUAL");
	
	//TOGGLE DOS CAMPOS DADOS DO COLABORADOR SUBSTITUTO
	toggleSubstituto();
	
	//DISPLAY DO CAMPO DE IMPRESSAO DO TERMO
	toggleBotaoTermo13Salario();
	
	toggleHistoricos();
	
	toggleAvisoDiaDaSemana(); 

		$("#Recibo").hide();
		$("#AvisFer").hide(); 
		$("#zoomLiqFerias").hide();  
	
	
	//processamento e ajuste
	if (atividade == 20 || atividade==26){
	FLUIGC.calendar('#cpDatadePagamento', {pickDate: true, pickTime: false});
	}
	
	if (atividade != 0 && atividade != 4) {
	    escondeTextoAvisoEstagiario();
	    escondeFeriasMarcadas();
	    escondeTextoAvisoColaborador();
	    
	} else if (atividade == 4) {
	    var situacaoFerias = $("#cpSituacaoFerias").val();
	    if (situacaoFerias == 'Não possuí férias marcadas') {
	        escondeFeriasMarcadas();
	    }
	}
	
	  if(atividade !== 9 && $("#cpAprovacaoSolicitante").val() == ''){
	    	$(".blockReabertura").hide();
	    }
	  
	   var aprovado = $("#cpAprovarAssinatura").val() == '1';
		$(".blockAvaliacao").toggle(aprovado); 
		
		carregaLimitedeFerias();
		
		
		
		
		//validando checkbox
		
		$("#Ckb1").click(function() {
		var Ckb1 = $("#Ckb1").val()
		if(Ckb1.checked=true){
			$("#Ckb1V").val("1");
		}else{
			$("#Ckb1V").val(" ");
		}
		});
		
		$("#Ckb2").click(function() {
		var Ckb2 = $("#Ckb2").val()
		if(Ckb2.checked=true){
			$("#Ckb2V").val("1");
		}else{
			$("#Ckb2V").val(" ");
		}
		});
		
		
});

var toggleAvisoDiaDaSemana = function() {
    var diaDaSemana = $("#cpDiaSemana").val(),
        mostraAviso = diaDaSemana === 'Terça-Feira';
    $("#diaSemanaNaoSegunda").toggle(mostraAviso);
};

//ABA DE APROVACAO ABERTA EM CADA ATIVIDADE
function abaAberta (atividade) {
	$('#panelAtividade_' + atividade).collapse("show").closest(".panel");
}

//DESTACA APROVACAO OU REPROVACAO
function destacaAprovacao () {
	$("[aprovacao]").each(function() {
		if(this.value == 1) {
			$(this).closest(".panel").addClass("panel-success");
			
		} else if (this.value == 2 || this.value == 3) {
			$(this).closest(".panel").addClass("panel-danger")
		} else if (this.value == 4) {
			$(this).closest(".panel").addClass("panel-warning")
		}
	});
}

//COM PARECER
function comParecer () {
	$("[parecer]").each(function() {
		var self = $(this);
		if (self.val().length > 0) {
			self.closest(".panel")
			.find(".panel-title")
			.append('&nbsp;<span class="label label-warning">Contém Parecer</span>');
		};
	});
}

//***************************************************************

var toggleSubstituto = function (substituto) {
	
	if (!substituto) {
		substituto = $("#cpHaveraSubstituto").val();
	}
	
	if (substituto == 1) {
		$("#dadosSubstituto").show();
	} else {
		escondeDadosSubstituto();
	}
};

var escondeDadosSubstituto = function () {
	$("#dadosSubstituto").hide();
};

//***************************************************************

//VERIFICA SE HA FILHOS NO PAI E FILHO
var toggleHistoricos = function() {
	
	$(".tabelaHistorico").each(function(){
		var filhos = $(this).find('tbody tr:not(:first-child)');
		if (filhos.length == 0) {
			$(this).closest('.row').hide();
		} else {
			filhos.each(function(){
				var campoHistorico = $(this).find('.HistAprov').get(0);
				if (!isNaN(parseInt(campoHistorico.value))) {
					campoHistorico.value = getTextOpcao(campoHistorico.dataset.select, campoHistorico.value);
				}
			});

		}
	});
};

var getTextOpcao = function(select, valor) {
	var prefix = $("#" + select).get(0).tagName == 'SELECT' ? '' : '_';
	return $("#" + prefix + select + " option[value=" + valor + "] ").html();
};

//***************************************************************
$(document).ready(function(){
	
	var atividade = getAtividade();

	// Lógica específica para a Atividade 93
    if (atividade == 93) {
        // --- Código adicionado anteriormente ---
        // Desabilita os checkboxes inicialmente (reforço, pois enabledFields já faz isso)
        $('#cpAnexoValidado, #cpFeriasValidada').prop('disabled', true);
        $('#cpAnexoValidado, #cpFeriasValidada').prop('checked', false); // Garante que comecem desmarcados

        // Adiciona evento ao botão "Verificar Anexos"
        $('#btnVerificarAnexos').on('click', function() {
            // Abre a aba/modal de anexos padrão do Fluig
            if (parent && parent.ECM && parent.ECM.workflowView && parent.ECM.workflowView.openAttachment) {
                 parent.ECM.workflowView.openAttachment();
            } else if (parent && parent.WKFView && parent.WKFView.showAttach) {
                 parent.WKFView.showAttach();
            } else if (window.parent && window.parent.parent && window.parent.parent.ECM && window.parent.parent.ECM.workflowView && window.parent.parent.ECM.workflowView.openAttachment) {
                 window.parent.parent.ECM.workflowView.openAttachment();
            }
             else {
                alert("Não foi possível abrir a aba de anexos automaticamente. Por favor, acesse-a manualmente.");
            }

            // Habilita o checkbox 'Anexo validado' após o clique no botão
            $('#cpAnexoValidado').prop('disabled', false);
        });
        // --- Fim do código adicionado anteriormente ---


        // ****** INÍCIO DA NOVA LÓGICA ******
        // Adiciona evento de mudança ao checkbox 'Anexo validado'
        $('#cpAnexoValidado').on('change', function() {
            // Verifica se o checkbox 'Anexo validado' está marcado
            if ($(this).is(':checked')) {
                // Se estiver marcado, habilita o checkbox 'Férias Validada'
                $('#cpFeriasValidada').prop('disabled', false);
            } else {
                // Se for desmarcado, desabilita e desmarca o checkbox 'Férias Validada'
                $('#cpFeriasValidada').prop('disabled', true);
                $('#cpFeriasValidada').prop('checked', false);
            }
        });
        // ****** FIM DA NOVA LÓGICA ******

    }
    // Fim da lógica da Atividade 93

	if ((atividade == 20 || atividade == 24  
			|| atividade == 26 || atividade == 60)) {
	//carregando os campos dentro de um template
	var acesso=$("#cpAcesso").val();
	$("#AvisFer").click(function() {
		if(acesso=="1"){
		  var dados = [];
		  var dadosFunc = {};
		  dados.Colaborador = getDadosColaboradores();
		  dados.DadosFerias = getDadosFerias();
		  dados.Assinatura = getAssinatura();
	      var template = 'avisodeferias.html';
	        
	      Compartilhados.PrintFormOpen(dados,template);
		}else{
			
		}
	});
	
	//carregando os campos dentro de um template
	$("#Recibo").click(function() {
		if(acesso=="1"){
		  var dados = [];
		  var dadosFunc = {};
		  
		  dados.novos = getNewDependents();
		  dados.Colaborador = getDadosColaboradores();
		  dados.DadosFerias = getDadosFerias();
		  dados.Assinatura = getAssinatura();
		  dados.Liquido = getDadosLiquido();  
	      var template = 'RecibodeFerias.html';
	        
	      Compartilhados.PrintFormOpen(dados,template);
		}else{
			
		}
	        
	});
	
	}

	//pegou os dados de campo fixo
	var getDadosColaboradores= function() {
	  var novo = [];
	  
	  	  CarregaDadosCTPS();
	  
	      novo = {
	    		  cpColaborador : $("#cpColaborador").val(),
	    		  cpMatricula : $("#cpMatricula").val(),
	    		  cpFuncao : $("#cpFuncao").val(),
	    		  cpCentroCusto : $("#cpCentroCusto").val(),
	    		  cpFimPeriodoAquisitivo : $("#cpFimPeriodoAquisitivo").val(),
	    		  cpDataInicioFerias : $("#cpDataInicioFerias").val(),
	    		  cpDataFimFerias : $("#cpDataFimFerias").val(),
	    		  cpDataRetorno:CalcDiadeRetorno(),
	    		  cpCartTrab:$("#cpCTPS").val(), 
	    		  cpSerie:$("#cpCTPSserie").val(),
	    		  cpSalario:$("#cpSalario").val(),
	    		  cpCPF:$("CPF").val()
	    		 
	    		       
	      };
	      
	  return novo;
	};
	
	//pegou os dados de campo fixo
	var getDadosFerias= function() {
	  var novo = [];
	  
	      novo = {
	    		  cpDataInicioFerias : $("#cpDataInicioFerias").val(),
	    		  cpDataFimFerias : $("#cpDataFimFerias").val(),
	    		  cpInicioPeriodoAquisitivo : $("#cpInicioPeriodoAquisitivo").val(),
	    		  cpFimPeriodoAquisitivo : $("#cpFimPeriodoAquisitivo").val(),
	    		  cpNumeroFaltas : $("#cpNumeroFaltas").val(),
	    		  cpNumeroAbono : $("#cpDiasAbono").val(),
	    		  cpEmpresa: $("#cpEmpresa").val() ,
	    		  cpLiquido: $("#LIQUIDOFERIAS").val(),
	    		  cpVlrExtenso: $("#cpVlrExtenso").val()  
	    		  
	    		  //
	    		       
	      };
	      
	  return novo;
	};
	
	
	//pegou os dados de campo fixo
	var getDadosLiquido= function() {
	  var novo = [];
	  
	      novo = {
	    			 VlrDESCONTO : $("#VlrDESCONTO").val(),
	    		     VlrPROVENTO : $("#VlrPROVENTO").val(),
	    		     liquidoferias: $("#LIQUIDOFERIAS").val()
	    		       
	      };
	      
	  return novo;
	};
	
	
	

	
	
	//pegou os dados de campo fixo
	var getAssinatura= function() {
	  var novo = [];
	  
	      novo = {
	    		  cpColaborador : $("#cpColaborador").val(),
	    		  cpGestorImediato : $("#cpGestorImediato").val(),
	    		  cpCalcDataProcessamento : CalcDataProcessamento(),
	    		  cpCidadeColigada:$("#cpCidadeCol").val(),
	    		  CARTAOUNIK:$("#CARTAOUNIK").val() 
	    		       
	      };
	      
	  return novo;
	};
	
	
	
	////evelope de ferias 
	
	//carregando os campos dentro de um template
	$("#printForm").click(function() {
		  var dados = [];
		  var dadosFunc = {};
		  dados.novos = getNewDependents();
		  dados.Colaborador = getDadosColaboradores();
	        var template = 'print.html';
	        
	        Compartilhados.PrintFormOpen(dados,template);
	});
	//pegando os dados de um array
	var getNewDependents = function() {
	    var novos = [];
	    
	    $("#tbItens tbody tr:not(:first-child)").each(function(){
	        var index = $('input:first', this ).attr('id').split('___')[1];
	        
	        var novo = {
	            evento : $("#EVENTO___" + index).val(),
	            quantidade : $("#QUANTIDADE___" + index).val(),
	            datapagto : $("#DATA_PAGTO___" + index).val(),
	            liquidoferias : $("#LIQUIDO_FERIAS___" + index).val(),
	            Provento : $("#PROVENTO___" + index).val(),
	            Desconto : $("#DESCONTO___" + index).val(),
	            
	        };
	        
	        novos.push(novo);
	    });
	    
	    
	    
	    return novos;
	};

	
	
	
	
	////
	});

function CalcDiadeRetorno(){
 	
	var Competencia = $("#cpDataFimFerias").val();;
	var dia = Competencia.substring(0,2); 
	var mes = Competencia.substring(3,5); 
	var ano= Competencia.substring(6,10);
	var AnoComp = new Date(mes+'/'+dia+'/'+ano);
	AnoComp.setDate(AnoComp.getDate() + 1);


	var diaCerto = AnoComp.getDate();
	if(diaCerto<10){
		diaCerto= "0"+diaCerto;
	}else{
		diaCerto = diaCerto;
	}
	var mesCerto = 	AnoComp.getMonth();
	mesCerto = parseFloat(mesCerto)+parseFloat(1);
	if(mesCerto<10){
		mesCerto= "0"+mesCerto;
	}else{
		mesCerto = mesCerto;
	}

	var anoCerto = 	AnoComp.getFullYear();

	return DataRetorno  = diaCerto+'/'+mesCerto+'/'+anoCerto;
}


//DATA SET PARA RETORNAR OS DADOS DOS PROCESSOS DE PAGAMENTO

function CarregaDadosCTPS() {

	var CODCOLIGADA = $("#cpColigada").val();
	var CHAPA = $("#cpMatricula").val();
	

	var fields = new Array(CHAPA,CODCOLIGADA );

	
	var CARTEIRATRAB = 0;
	var SERIECARTTRAB = 0;
	var CIDADECOLIGADA = 0;
	var SALARIO=0;
	try {

		var tabela = DatasetFactory.getDataset("DS_FLUIG_0003", fields, null, null);


		for (var i = 0; i < tabela.values.length; i++) {
			
			CARTEIRATRAB = tabela.values[i].CARTEIRATRAB.toString();
			SERIECARTTRAB = tabela.values[i].SERIECARTTRAB.toString();
			CIDADECOLIGADA = tabela.values[i].CIDADECOLIGADA.toString();
			SALARIO = tabela.values[i].SALARIO.toString();
			CPF = tabela.values[i].CPF.toString();

				$("#cpCTPS").val(CARTEIRATRAB);
				$("#cpCTPSserie").val(SERIECARTTRAB);
				$("#cpCidadeCol").val(CIDADECOLIGADA);
				$("#cpSalario").val(SALARIO);
				$("#CPF").val(CPF);
				

		}
	}

	catch (erro) {
		window.alert(erro);
	}

	//return valor;
	return 0;

}

function CalcDataProcessamento(){
	var Ferias = $("#cpDataInicioFerias").val();
	Ferias = Ferias.substring(3,5)+'/'+Ferias.substring(0,2)+'/'+Ferias.substring(6,10);
	console.log("Andre Ferias2 "+Ferias);
	var date = new Date(Ferias);
	date.setDate(date.getDate() - 30);
	var dia = date.getDate();
	if(parseFloat(dia)<parseFloat(10)){
		dia = '0'+dia;
	}else{
		dia = dia;
	}
	console.log("Andre dia "+dia);
	var mes = date.getMonth();
	mes = mes+1;
	if(parseFloat(mes)<parseFloat(10)){
		mes = '0'+mes;
	}else{
		mes = mes;
	}
	console.log("Andre mes "+mes);
	var ano = date.getFullYear();
	var DatadePagamento = (dia+'/'+mes+'/'+ano);

	return DatadePagamento;
	
}

function carregaLimitedeFerias(){

	var FimPerAqui = $("#cpFimPeriodoAquisitivo").val();
	var dia = FimPerAqui.substring(0,2);
	var mes = FimPerAqui.substring(3,5);
	var ano = FimPerAqui.substring(6,10);

	var fimPer = new Date (ano+'/'+mes+'/'+dia);
	var Fim = new Date(fimPer.setMonth(fimPer.getMonth()+11));


	var IniFerias = $("#cpDataInicioFerias").val();
	var diaIni = IniFerias.substring(0,2);
	var mesIni = IniFerias.substring(3,5);
	var anoIni = IniFerias.substring(6,10);

	var fimF = new Date (anoIni+'/'+mesIni+'/'+diaIni);
	if(Fim!="" && fimF!=""){
	if(Fim>fimF){
		$("#exibeLimiteInfIniciofer").show();
	}else{
		$("#exibeLimiteInfIniciofer").hide();
	}
	}else {
		$("#exibeLimiteInfIniciofer").hide();
	}

}
