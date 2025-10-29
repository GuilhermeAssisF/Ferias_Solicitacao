function validateForm(form) {

	log.info("INICIO do VALIDATE do formulário FLUIG-0001 - FERIAS");

	var atividade = getValue("WKNumState");
	var ATIVIDADE_GERAR_ARQUIVO = 112; // Define a constante para a atividade 112 - Gerar Arquivo de Pagamento
	var ATIVIDADE_VALIDAR_KIT_FERIAS = 153; // Define a constante para a atividade 153 - Validar Kit de Férias
	var funcao = form.getValue('cpFuncao');
	var acaoUsuario = getValue("WKCompletTask");
	var Errors = [];

	function isEstagiario(funcao) {
		return funcao.search('ESTAGIARIO') > -1;
	};


	function validaAprovacao(aprovacao, parecer) {
		if (form.getValue(aprovacao) == 0) {
			Errors.push('Aprovação não preenchida');
		}

		if (form.getValue(aprovacao) == 2 && form.getValue(parecer) == '') {
			Errors.push('Parecer não prenchido');
		}
	}

	function validaVazio(campo, mensagem) {
		if (form.getValue(campo) == '') {
			Errors.push(mensagem);
		}
	}

	function validaNotSelected(campo, mensagem) {
		if (form.getValue(campo) == '') {
			Errors.push(mensagem);
		}
	}

	// Função auxiliar DENTRO do validateForm para ter acesso ao 'form'
	var getDtConvertida = function (campo) {
		var dtArray = String(form.getValue(campo)).split('/');
		return new Date(dtArray[2], dtArray[1] - 1, dtArray[0]);
	};

	if (atividade == 0 || atividade == 4 || atividade == 9 && (acaoUsuario == "true")) {



		//NAO PERMITE ABRIR FERIAS PARA QUEM JA POSSUI FERIAS MARCADAS
		var situacaoFerias = form.getValue('cpSituacaoFerias');
		if (situacaoFerias == "Possuí férias marcadas") {
			Errors.push('Não é possível abrir solicitação de férias para quem já possuí férias marcadas.');

		} else {

			//DIAS DE FERIAS MAIS DIAS DE ABONO NAO PODEM SER MAIOR QUE DIAS DE DIREITO
			var diasFerias = parseInt(form.getValue('cpDiasFerias'));
			var diasAbono = 0;
			var diasDireito = parseInt(form.getValue('cpDiasDireito'));

			if (!isEstagiario(funcao)) {
				diasAbono = parseInt(form.getValue('cpDiasAbono'));
			}

			/*if (!isEstagiario(funcao) && ((diasFerias + diasAbono) != diasDireito)) {
				Errors.push('Dias de Férias somados com Dias de Abono diferente de Dias de Direito.');
			}*/

			if (isEstagiario(funcao)) {
				if (diasFerias < 5) {
					Errors.push('Não é permitido tirar menos do que 5 Dias de Férias.');
				}

				if (diasFerias > diasDireito) {
					Errors.push('Não é permitido tirar Dias de Férias maior que os Dias de Direito.');
				}
			}

			if (isEstagiario(funcao)) {
				var dataFimFerias = getDtConvertida('cpDataFimFerias'),
					dataFimContrato = getDtConvertida('cpFimContrato');
				if (dataFimFerias > dataFimContrato) {
					Errors.push('Não é permitido tirar Dias de Férias depois que o contrato terminou.');
				}
			}

			//validade idade e abono
			var abono = form.getValue('cpHaveraAbono');
			var idade = parseInt(form.getValue('cpIdade'));
			/*	if(abono=="1" && (idade>parseInt(50) || idade<parseInt(18))){
					Errors.push('O abono de férias não pode ser utilizado, por colaboradores menores de 18 anos e maiores de 50 anos.');
				}*/
			var cpJaTemFerias = parseInt(form.getValue('cpJaTemFerias'));
			var vazio = "";
			if (cpJaTemFerias == "1") {
				Errors.push('Já existe chamado de férias aberto, para este colaborador.');
			}


			//final do proximo periodo aquisitivo
			var cpfimfperAquiData = form.getValue('cpfimfperAquiData');
			var FimFerias = form.getValue('cpDataFimFerias');


			if (FimFerias != '') {
				//coloca data em formato brasileiro
				var Dtnac = new Date(cpfimfperAquiData);
				var diaDataNac = Dtnac.getDate();
				var mesDataNac = Dtnac.getMonth();
				mesDataNac = mesDataNac;
				var anoDataNac = Dtnac.getFullYear();

				if (diaDataNac < 10) {
					diaDataNac = "0" + diaDataNac;
				} if (mesDataNac < 10) {
					mesDataNac = "0" + mesDataNac;
				}

				var faltas = form.getValue('cpNumeroFaltas');

				var datafimNac = new Date(mesDataNac + "/" + diaDataNac + "/" + anoDataNac);

				if (parseFloat(faltas) > parseFloat(0)) {
					datafimNac.setDate(datafimNac.getDate() + parseFloat(1) + parseFloat(faltas));
				} else {
					datafimNac.getDate();
				}
				var mesprox = datafimNac.getMonth();
				var diaprox = datafimNac.getDate();
				mesprox = parseFloat(mesprox) + parseFloat(1);

				if (mesprox < 10) {
					mesprox = "0" + mesprox;
				} if (diaprox < 10) {
					diaprox = "0" + diaprox;
				}

				var DataFinaldoprox = diaprox + "/" + mesprox + "/" + datafimNac.getFullYear();
				//data final do periodo de ferias 


				var Data = FimFerias;
				var diaData = Data.substring(0, 2);
				var mesData = Data.substring(3, 5);
				var anoData = Data.substring(6, 10);


				var datafim = new Date(mesData + "/" + diaData + "/" + anoData);

				/*if(new Date(datafim)>new Date(cpfimfperAquiData)){
					Errors.push('A data final das férias, não pode ser superior ao Início do próximo período aquisitivo '+ DataFinaldoprox);
				}	*/
			} // Fim do if (FimFerias != '')

			//dados do colaborador
			validaVazio('cpCentroCusto', 'Obra/Departamento não informado');
			validaNotSelected('cpColaborador', 'Colaborador não informado');
			validaVazio('cpMatricula', 'Matrícula não informada');
			validaVazio('cpFuncao', 'Função não informada');
			validaVazio('cpDataAdmissao', 'Data de admissão não informada');
			validaVazio('cpDtPagto', 'Data de Pagamento não informada');

			// // ##############################################################################################################
			// // Validação da data de pagamento conforme CLT - deve ser com mais de 2 dias de antecedência do início das férias
			// // ##############################################################################################################
			// if (form.getValue('cpDataInicioFerias') != '' && form.getValue('cpDtPagto') != '') {
			// 	try {
			// 		// Função auxiliar para converter dd/MM/yyyy para Date
			// 		var parseDate = function (dateStr) {
			// 			var parts = dateStr.split('/');
			// 			// new Date(year, monthIndex, day) - monthIndex é 0-based
			// 			return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
			// 		};

			// 		var dataInicioFeriasStr = form.getValue('cpDataInicioFerias');
			// 		var dataPagamentoStr = form.getValue('cpDtPagto');

			// 		var dataInicioFerias = parseDate(dataInicioFeriasStr);
			// 		var dataPagamento = parseDate(dataPagamentoStr);

			// 		// Calcula a data limite para pagamento (2 dias antes do início das férias)
			// 		var dataLimitePagamento = new Date(dataInicioFerias);
			// 		dataLimitePagamento.setDate(dataInicioFerias.getDate() - 2);

			// 		// Define as horas, minutos, segundos e milissegundos para 0 para comparar apenas as datas
			// 		dataPagamento.setHours(0, 0, 0, 0);
			// 		dataLimitePagamento.setHours(0, 0, 0, 0);

			// 		// Valida se a data de pagamento NÃO é ANTERIOR à data limite de 2 dias antes.
			// 		// Conforme o exemplo: se inicia dia 24, não pode pagar dia 22 ou 23. Deve ser 21 ou antes.
			// 		// Isso significa que a data de pagamento não pode ser maior ou igual à data limite.
			// 		if (dataPagamento >= dataLimitePagamento) {
			// 			Errors.push('Conforme a norma da CLT, o pagamento deve ser efetuado com mais de 2 dias de antecedência do início das férias.');
			// 		}

			// 	} catch (e) {
			// 		log.error("Erro ao validar datas de pagamento/início de férias: " + e);
			// 		Errors.push("Erro ao processar as datas. Verifique os formatos (dd/MM/yyyy).");
			// 	}
			// }


			/*	var solicitante = form.getValue('cpMatriculaSolicitante'),
				diretor = form.getValue('cpDiretor');
	
				if (solicitante != diretor) {
					validaVazio('cpGestorImediato', 'Gestor imediato não informado');
				}*/

			//dados do periodo aquisitivo
			validaVazio('cpSituacaoFerias', 'Situação das férias não informada');
			validaVazio('cpInicioPeriodoAquisitivo', 'Inicío do período aquisitivo não informado');
			validaVazio('cpFimPeriodoAquisitivo', 'Fim do período aquisitivo não informado');
			validaVazio('cpNumeroFaltas', 'Número de faltas não informado');
			//dados das ferias
			validaVazio('cpDiasDireito', 'Dias de direito não informado');
			if (!isEstagiario(funcao)) {
				validaVazio('cpHaveraAbono', 'Haverá abono não informado');
				validaVazio('cpDiasAbono', 'Dia de abono não informado');
				validaVazio('cpAntecipar13Salario', 'Antecipar o pagamento da 1ª parcela do 13º salário não informado');
				var antecipar13Salario = form.getValue('cpAntecipar13Salario');
				var selecionouImpressao = form.getValue('cp13SalarioImprimir');
				if (antecipar13Salario == 1) {
					if (selecionouImpressao == 'N') {
						Errors.push('É necessário imprimir e assinar o Termo de Adiantamento do 13º salário');
					}
				}
			}
			// Só valida Data Fim, Dias Férias e Dia Semana se NÃO for "Somente Abono"
            if (form.getValue('cpHaveraAbono') != '3') {
				validaVazio('cpDataInicioFerias', 'Data de início não informada');
                validaVazio('cpDataFimFerias', 'Data fim não informada');
                validaVazio('cpDiasFerias', 'Dias de férias não informado');
                validaVazio('cpDiaSemana', 'Dia da semana não informada');
            }

			//dados do substituto
			var haveraSubstituto = form.getValue('cpHaveraSubstituto');
			validaVazio('cpHaveraSubstituto', 'Haverá substituto não informado');

			if (haveraSubstituto == 1) {
				validaVazio('cpCentroCustoSubstituto', 'Obra/Departamento do substituto não informado');
				validaVazio('cpColaboradorSubstituto', 'Colaborador substituto não informado');
				validaVazio('cpMatriculaSubstituto', 'Matrícula do substituto não informado');
			}

		}

		/*	validaVazio('Ckb1V','Aviso de Férias.');
			validaVazio('Ckb2V','Recibo de Férias.')*/



	}

	if (atividade == 14 && (acaoUsuario == "true")) { //GESTOR IMEDIATO
		validaAprovacao('cpAprovarGestor', 'cpParecerGestor');

	}
	if (atividade == 20 && (acaoUsuario == "true")) { //GESTOR IMEDIATO EM ATRASO
		validaAprovacao('cpAprovarGestor2', 'cpParecerGestor2');

	}

	// --- Validações da Validação de Férias RH (136) ---
	if (atividade == 136) { // Corrigido para verificar apenas se a ação é de envio
		if (acaoUsuario == "true") { // Adicionado para garantir a validação apenas no envio
			if (form.getValue("cpAprovarGestor3") == "") {
				Errors.push("O campo 'Aprovação' do RH é obrigatório.");
			}
			if (form.getValue("cpAprovarGestor3") == "2" && form.getValue("cpParecerGestor3") == "") { // Reprovado exige parecer
				Errors.push("O 'Parecer' do RH é obrigatório ao solicitar correção.");
			}
		}
	}

	// --- Validações Ajustadas da Validação do Kit (RH Pós-BPO) (153) ---
	if (atividade == ATIVIDADE_VALIDAR_KIT_FERIAS) {
		log.info("--- Validando Atividade 153 ---");
		if (acaoUsuario == "true") { // Garante a validação apenas no envio da tarefa

			var aprovacaoKit = form.getValue("cpAprovacaoValidacaoKit"); // Pega o valor da aprovação

			// Validação obrigatória: O campo 'Validação do Kit' deve ser selecionado
			if (aprovacaoKit == "" || aprovacaoKit == null) {
				Errors.push("O campo 'Validação do Kit' é obrigatório.");
			}

			// Validação CONDICIONAL: 'Anexos Validados' só é obrigatório se estiver APROVANDO (valor 1)
			if (aprovacaoKit == "1") {
				if (form.getValue("cpAnexosValidadosKit") != "on") {
					Errors.push("É obrigatório marcar a caixa 'Anexos Validados' ao aprovar o kit.");
					// A mensagem de erro anterior sobre clicar no botão não é mais necessária aqui,
					// pois o validateForm não sabe se o botão foi clicado, apenas se a caixa está marcada.
					// A lógica no view.js já lida com a habilitação via botão.
				}
			}

			// Validação CONDICIONAL: 'Parecer' é obrigatório se estiver SOLICITANDO CORREÇÃO (valor 2)
			if (aprovacaoKit == "2" && (form.getValue("cpParecerValidacaoKit") == "" || form.getValue("cpParecerValidacaoKit") == null)) {
				Errors.push("O 'Parecer Validação Kit' é obrigatório ao solicitar correção para o BPO.");
			}

			log.info("--- Fim Validação Atividade 153 ---");
		}
	}
	// --- Fim do Bloco Ajustado para Atividade 153 ---

	if (atividade == 9 && (acaoUsuario == "true")) { //reabertura
		validaAprovacao('cpAprovacaoSolicitante', 'cpParecerAprovacaoSolicitante');

	}

	// Validação para a Atividade 90 (Gerar Kit Férias - Analista BPO)
	if (atividade == 90 && (acaoUsuario == "true")) {
		// Verifica se a flag 'Cadastro' está marcada (deve estar por padrão)
		if (form.getValue("cpFlagCadastro") != "on") {
			Errors.push("A flag 'Cadastro' deve estar marcada."); // Segurança
		}
		// Verifica se a flag 'Cálculo' está marcada
		if (form.getValue("cpFlagCalculo") != "on") {
			Errors.push("Por favor, marque a flag 'Cálculo'.");
		}
		// Verifica se a flag 'Kit Férias' está marcada
		if (form.getValue("cpFlagKitFerias") != "on") {
			Errors.push("Por favor, marque a flag 'Kit Férias'.");
		}

		// Valida se o parecer foi preenchido
		// validaVazio('cpParecerProcessamento', 'O parecer do Analista BPO é obrigatório.');
	}

	// Validação para a Atividade 93 (Validar Kit Férias)
	if (atividade == 93 && (acaoUsuario == "true")) {

		// Valida se o checkbox "Anexo validado" foi marcado
		if (form.getValue("cpKitAssinado") != "on") {
			Errors.push("É obrigatório marcar a opção 'Assinado' para prosseguir.");
		}


		// Validação da Avaliação (Mantida - ajuste se a lógica de aprovação mudou)
		// Verifique se a avaliação ainda deve depender do cpAprovarGestor3 ou se deve ser sempre obrigatória
		var aprovacaoRH = form.getValue("cpAprovarGestor3"); // Pega a decisão do RH na etapa anterior (136/153)
		if (aprovacaoRH == '1') { // Só exige avaliação se o RH validou
			// validaNotSelected('cpAprovarAvaliacao', 'É necessário preencher a Avaliação do atendimento.');
			// if ((form.getValue("cpAprovarAvaliacao") == '3' || form.getValue("cpAprovarAvaliacao") == '4') && form.getValue("cpParecerAvaliacao") == '') {
			// 	Errors.push('É necessário justificar a Avaliação Insatisfeito ou Muito Insatisfeito.');
			// }
		}
		// Você pode adicionar um 'else' aqui se precisar validar algo específico caso o RH tenha reprovado na etapa anterior
	}

	// *** INÍCIO DA VALIDAÇÃO PARA ATIVIDADE 112 ***
	if (atividade == ATIVIDADE_GERAR_ARQUIVO && (acaoUsuario == "true")) {
		// Verifica se a flag 'Arquivo Bancário Gerado' está marcada
		if (form.getValue("cpArquivoBancario") != "on") {
			Errors.push("É obrigatório marcar a flag 'Arquivo Bancário Gerado'.");
		}
		// Verifica se a flag 'Lançamento Financeiro Realizado' está marcada
		if (form.getValue("cpLancamentoFinanceiro") != "on") {
			Errors.push("É obrigatório marcar a flag 'Lançamento Financeiro Realizado'.");
		}
	}
	// *** FIM DA VALIDAÇÃO PARA ATIVIDADE 112 ***

	if (Errors.length) {
		throw Errors[0];
	}

	log.info("FIM do VALIDATE do formulário FLUIG-0001 - FERIAS");
	/*
	var e;
	var msg = '';
	for (e = 0; e < Errors.length; e++) {
		msg += '\n' + Errors[e];
	}
	
	if (msg != '') {
		throw msg;
	}
	 */
}