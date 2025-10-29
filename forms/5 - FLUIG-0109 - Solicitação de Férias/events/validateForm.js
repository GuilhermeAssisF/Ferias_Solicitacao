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

		} else { // Início do else (!situacaoFerias == "Possuí férias marcadas")

			// Validações gerais para Estagiário (já existentes)
			var diasFerias = parseInt(form.getValue('cpDiasFerias')) || 0; // Pega dias de férias calculados no form
			var diasDireito = parseInt(form.getValue('cpDiasDireito')) || 0; // Pega dias de direito

			if (isEstagiario(funcao)) {
				if (diasFerias < 5) {
					Errors.push('Não é permitido tirar menos do que 5 Dias de Férias.');
				}
				if (diasFerias > diasDireito) {
					Errors.push('Não é permitido tirar Dias de Férias maior que os Dias de Direito.');
				}
				// Validar conversão de data antes de comparar
				if (form.getValue('cpDataFimFerias') && form.getValue('cpFimContrato')) {
					try {
						var dataFimFerias = getDtConvertida('cpDataFimFerias');
						var dataFimContrato = getDtConvertida('cpFimContrato');
						if (dataFimFerias > dataFimContrato) {
							Errors.push('Não é permitido tirar Dias de Férias depois que o contrato terminou.');
						}
					} catch (e) {
						Errors.push('Erro ao comparar datas de Fim de Férias e Fim de Contrato. Verifique os formatos.');
					}
				} else if (isEstagiario(funcao) && !form.getValue('cpFimContrato')) {
					Errors.push('Data Fim do Contrato não encontrada para o estagiário.'); // Adicionado para clareza
				}
			}

			// Validação de chamado já aberto (já existente)
			var cpJaTemFerias = form.getValue('cpJaTemFerias'); // Ler como string ou valor direto
			if (cpJaTemFerias == "1") { // Comparar como string
				Errors.push('Já existe chamado de férias aberto, para este colaborador.');
			}

			// Validação do fim do período aquisitivo (já existente, embora comentada a verificação final)
			var cpfimfperAquiData = form.getValue('cpfimfperAquiData'); // Ex: 2025-10-29T14:48:00 ou yyyy-MM-dd
			var FimFerias = form.getValue('cpDataFimFerias'); // Ex: 29/10/2025

			if (FimFerias != '' && cpfimfperAquiData != '' && haveraAbono != '3') { // Adicionado haveraAbono != '3' para não validar em "Somente Abono"
				try {
					log.info("### Validando Datas Fim Férias vs Fim Período Aquisitivo ###");
					log.info("cpfimfperAquiData (raw): " + cpfimfperAquiData);
					log.info("cpDataFimFerias (raw): " + FimFerias);

					// --- Conversão Segura da Data Fim Período Aquisitivo ---
					var dataFimPerAquiStr = cpfimfperAquiData.substring(0, 10); // Pega apenas a parte da data "yyyy-MM-dd"
					var partesFimPerAqui = dataFimPerAquiStr.split('-');
					// new Date(ano, mesIndex, dia) - mesIndex é 0-based
					var Dtnac = new Date(parseInt(partesFimPerAqui[0], 10), parseInt(partesFimPerAqui[1], 10) - 1, parseInt(partesFimPerAqui[2], 10));
					Dtnac.setHours(0, 0, 0, 0); // Zera hora para comparar só data
					log.info("Data Fim Período Aquisitivo (Dtnac - Date): " + Dtnac);


					// Formata para exibição na mensagem de erro (já existente)
					var diaDataNac = Dtnac.getDate();
					var mesDataNac = Dtnac.getMonth();
					var anoDataNac = Dtnac.getFullYear();
					var diaFormatado = diaDataNac < 10 ? "0" + diaDataNac : diaDataNac;
					// Corrigido: mesDataNac já é 0-based, então +1 para formatar
					var mesFormatado = (mesDataNac + 1) < 10 ? "0" + (mesDataNac + 1) : (mesDataNac + 1);
					var DataFinaldoprox = diaFormatado + "/" + mesFormatado + "/" + anoDataNac;
					log.info("Data Fim Período Aquisitivo (Formatada dd/MM/yyyy): " + DataFinaldoprox);


					// --- Conversão Segura da Data Fim Férias ---
					var datafim = getDtConvertida('cpDataFimFerias'); // Usa a função auxiliar (dd/MM/yyyy -> Date)
					datafim.setHours(0, 0, 0, 0); // Zera hora para comparar só data
					log.info("Data Fim Férias (datafim - Date): " + datafim);


					/* // Verificação comentada no original - Descomentar e testar se a regra for necessária
					if (datafim > Dtnac) {
						Errors.push('A data final das férias (' + FimFerias + ') não pode ser superior ao Fim do Período Aquisitivo (' + DataFinaldoprox + ').');
					}
					*/
				} catch (e) {
					log.error("### Erro ao converter/comparar datas Fim Férias vs Fim Período: " + e);
					// Adiciona detalhes ao erro para facilitar a depuração
					Errors.push('Erro ao comparar datas de Fim de Férias (' + FimFerias + ') e Fim de Período Aquisitivo (' + cpfimfperAquiData + '). Verifique os formatos e valores. Detalhe: ' + e.message);
				}
			} // Fim do if (FimFerias != '' && cpfimfperAquiData != '' && haveraAbono != '3')

			// Validações de campos básicos do colaborador (já existentes)
			validaVazio('cpCentroCusto', 'Obra/Departamento não informado');
			validaNotSelected('cpColaborador', 'Colaborador não informado');
			validaVazio('cpMatricula', 'Matrícula não informada');
			validaVazio('cpFuncao', 'Função não informada');
			validaVazio('cpDataAdmissao', 'Data de admissão não informada');
			validaVazio('cpDtPagto', 'Data de Pagamento não informada');

			// Validações básicas do período aquisitivo (já existentes)
			validaVazio('cpSituacaoFerias', 'Situação das férias não informada');
			validaVazio('cpInicioPeriodoAquisitivo', 'Inicío do período aquisitivo não informado');
			validaVazio('cpFimPeriodoAquisitivo', 'Fim do período aquisitivo não informado');
			validaVazio('cpNumeroFaltas', 'Número de faltas não informado');

			// Validações básicas dos dados das férias (já existentes)
			validaVazio('cpDiasDireito', 'Dias de direito não informado');

			// ########## INÍCIO - Validação CORRIGIDA para Dias de Abono ##########
			var haveraAbono = form.getValue('cpHaveraAbono');
			var diasAbonoStr = form.getValue('cpDiasAbono');
			var diasAbonoNum = parseInt(diasAbonoStr);
			var diasFeriasCalculado = parseInt(form.getValue('cpDiasFerias')) || 0;

			// Validações aplicáveis apenas se NÃO for estagiário
			if (!isEstagiario(funcao)) {
				validaVazio('cpHaveraAbono', 'Haverá abono não informado');

				if (haveraAbono == '1' || haveraAbono == '3') { // Se Abono for SIM ou Somente Abono
					if (diasAbonoStr == '' || diasAbonoNum <= 0) {
						Errors.push('O campo "Dias de Abono" é obrigatório e deve ser um número inteiro maior que zero quando houver abono.');
					}
					else if (isNaN(diasAbonoNum) || diasAbonoStr != diasAbonoNum.toString()) {
						Errors.push('O campo "Dias de Abono" deve ser um número inteiro válido.');
					}
					else {
						var maxAbono = Math.floor(diasDireito / 3);
						if (diasAbonoNum > maxAbono) {
							Errors.push('Os "Dias de Abono" (' + diasAbonoNum + ') não podem exceder 1/3 dos Dias de Direito (' + maxAbono + ').');
						}

						// Validação específica para "Somente Abono"
						if (haveraAbono == '3') {
							if (diasFeriasCalculado != 0) {
								Errors.push('[Erro Interno] Para "Somente Abono", os Dias de Férias calculados deveriam ser 0.');
							}
							// CORREÇÃO: Não validar a soma se for "Somente Abono"
						}
						// Validação específica para "SIM" (Abono + Férias)
						else { // haveraAbono == '1'
							if (diasFeriasCalculado <= 0) {
								Errors.push('Com a opção "SIM" para abono, deve haver dias de férias a gozar.');
							}
							// CORREÇÃO: Validar a soma SOMENTE se for "SIM"
							if (diasFeriasCalculado + diasAbonoNum != diasDireito) {
								Errors.push('A soma dos Dias de Férias (' + diasFeriasCalculado + ') e Dias de Abono (' + diasAbonoNum + ') deve ser igual aos Dias de Direito (' + diasDireito + '). Verifique os valores informados.');
							}
							// Valida datas início/fim (coberto pela validação genérica abaixo)
						}
					}
				} else if (haveraAbono == '2') { // Se abono for NÃO
					if (diasAbonoNum != 0) {
						Errors.push('[Erro Interno] Se não houver abono, os Dias de Abono deveriam ser 0.');
					}
					if (diasFeriasCalculado != diasDireito) {
						Errors.push('Se não houver abono, os Dias de Férias (' + diasFeriasCalculado + ') devem ser iguais aos Dias de Direito (' + diasDireito + ').');
					}
					// Valida datas início/fim (coberto pela validação genérica abaixo)
				}

				// Validação do 13º (AJUSTADA para checkbox)
				var antecipar13SalarioChecked = form.getValue('cpAntecipar13Salario') == "on"; // Verifica se está marcado
				var selecionouImpressao = form.getValue('cp13SalarioImprimir');
				if (antecipar13SalarioChecked) { // Se o checkbox estiver marcado...
					if (selecionouImpressao != 'S') { // ...e a flag de impressão não for 'S' (indicando que o botão foi clicado com sucesso)
						Errors.push('É necessário imprimir e assinar o Termo de Adiantamento do 13º salário ao marcar a opção de antecipar.');
					}
				}

			} else { // Se for Estagiário
				if (form.getValue('cpHaveraAbono') != '2' || form.getValue('cpDiasAbono') != '0') {
					Errors.push('Estagiários não podem solicitar abono pecuniário.');
				}
				if (diasFeriasCalculado != diasDireito) {
					Errors.push('Para estagiários, os Dias de Férias (' + diasFeriasCalculado + ') devem ser iguais aos Dias de Direito (' + diasDireito + ').');
				}
				// Valida datas início/fim (coberto pela validação genérica abaixo)
			}

			// Validação genérica para datas e dias (necessária quando há gozo de férias)
			if (form.getValue('cpHaveraAbono') != '3') { // Se NÃO for "Somente Abono"
				validaVazio('cpDataInicioFerias', 'Data de início não informada');
				validaVazio('cpDataFimFerias', 'Data fim não informada');
				if (diasFeriasCalculado <= 0) { // Não precisa mais checar haveraAbono != '3' aqui
					Errors.push('Deve haver Dias de Férias a gozar quando a opção não é "Somente Abono".');
				} else {
					validaVazio('cpDiaSemana', 'Dia da semana não informada');
				}
			}
			// ########## FIM - Validação CORRIGIDA para Dias de Abono ##########

			// dados do substituto (já existente)
			var haveraSubstituto = form.getValue('cpHaveraSubstituto');
			validaVazio('cpHaveraSubstituto', 'Haverá substituto não informado');

			if (haveraSubstituto == 1) {
				validaVazio('cpCentroCustoSubstituto', 'Obra/Departamento do substituto não informado');
				validaVazio('cpColaboradorSubstituto', 'Colaborador substituto não informado');
				validaVazio('cpMatriculaSubstituto', 'Matrícula do substituto não informado');
			}

		} // Fim do else (!situacaoFerias == "Possuí férias marcadas")

	} // Fim do if (atividade == 0 || atividade == 4 || atividade == 9 ... )

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