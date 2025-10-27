function enableFields(form) {

	log.info("INICIO do EnableFields do formulário FLUIG-0001 - FERIAS"); //

	var atividade = parseInt(getValue("WKNumState")); //
	var ATIVIDADE_GERAR_ARQUIVO = 112; // Define a constante para a atividade
	var ATIVIDADE_ASSINAR_KIT = 93; // Define a constante para a atividade de assinar kit
	var ATIVIDADE_GERAR_KIT = 90; // Define a constante para a atividade de gerar kit

	// Lista de campos habilitados por atividade (Regra Geral)
	// Removido Ckb1 e Ckb2 da atividade 93
	var Campos = new Array(
		//inicio e correcao
		{ "campo": "cpSolicitacaoPara", "atividade": "0,4,9" }, //
		{ "campo": "cpHaveraAbono", "atividade": "0,4,9" }, //
		{ "campo": "cpAntecipar13Salario", "atividade": "0,4,9" }, //
		{ "campo": "cpHaveraSubstituto", "atividade": "0,4,9" }, //
		{ "campo": "cpObs", "atividade": "0,4,9" }, //

		//REABERTURA
		{ "campo": "cpAprovacaoSolicitante", "atividade": "9" }, //
		{ "campo": "cpParecerAprovacaoSolicitante", "atividade": "9" }, //
		//GESTOR IMEDIATO
		{ "campo": "cpAprovarGestor", "atividade": "14" }, //
		{ "campo": "cpParecerGestor", "atividade": "14" }, //
		//GESTOR IMEDIATO EM ATRASO
		{ "campo": "cpAprovarGestor2", "atividade": "20" }, //
		{ "campo": "cpParecerGestor2", "atividade": "20" }, //

		//VALIDAR O KIT (ATIVIDADE 93)
		{ "campo": "cpAprovarAvaliacao", "atividade": "93" }, // Habilitado para avaliação
		{ "campo": "cpParecerAvaliacao", "atividade": "93" }, // Habilitado para avaliação
		// { "campo": "Ckb1", "atividade": "93" }, // Removido
		// { "campo": "Ckb2", "atividade": "93" }, // Removido

		//GERAR O KIT (BPO)
		{ "campo": "cpParecerProcessamento", "atividade": "90" }, //

		// ADICIONADO PARA ATIVIDADE 112
		{ "campo": "cpArquivoBancario", "atividade": ATIVIDADE_GERAR_ARQUIVO.toString() },
		{ "campo": "cpLancamentoFinanceiro", "atividade": ATIVIDADE_GERAR_ARQUIVO.toString() },
		{ "campo": "cpParecerArquivoPagamento", "atividade": ATIVIDADE_GERAR_ARQUIVO.toString() }, // Habilita o parecer opcional
		// FIM DA ADIÇÃO

		//validar ferias rh (agrupado)
		{ "campo": "cpAprovarGestor3", "atividade": "153,136" }, //
		{ "campo": "cpParecerGestor3", "atividade": "153,136" }  //

	); //

	// Loop padrão para habilitar/desabilitar campos com base no array 'Campos'
	for (var item in Campos) { //
		var Campo = Campos[item], //
			atividades = Campo["atividade"].split(","); //

		// Verifica se a atividade atual está na lista de atividades do campo
		if (atividades.indexOf(atividade.toString()) >= 0) { //
			form.setEnabled(Campo["campo"], true); // Habilita o campo //

		} else {
			// Desabilita o campo se não estiver na atividade correta
			// Garante que campos não explicitamente listados para a atividade atual sejam desabilitados
			var habilitarCampo = false;
			for (var i = 0; i < atividades.length; i++) {
				if (parseInt(atividades[i]) === atividade) {
					habilitarCampo = true;
					break;
				}
			}
			if (!habilitarCampo) {
				// Verifica se o campo existe antes de tentar desabilitar
				try {
					// Tenta acessar o campo para ver se ele existe no formulário atual
					// Isso evita erros caso um campo listado não exista de fato no HTML
					if (form.getValue(Campo["campo"]) != null || form.getField(Campo["campo"]) != null) {
						form.setEnabled(Campo["campo"], false);
					}
				} catch (e) {
					log.warn("Campo [" + Campo["campo"] + "] não encontrado no formulário ao tentar desabilitar. Ignorando.");
				}
			}
		}
	}

	// --- TRATAMENTOS ESPECÍFICOS POR ATIVIDADE ---

	// Garante que flags da Atividade 90 estejam DESABILITADAS, EXCETO na atividade 90
    if (atividade != ATIVIDADE_GERAR_KIT) {
        form.setEnabled("cpFlagCalculo", false);
        form.setEnabled("cpFlagKitFerias", false);
        // cpFlagCadastro geralmente é apenas leitura após a criação, então desabilitamos sempre
        form.setEnabled("cpFlagCadastro", false);
    }

	// Condição específica para a Atividade 90 (BPO)
	if (atividade == 90) { //
		form.setEnabled("cpFlagCadastro", false); // Mantém cpFlagCadastro desabilitado (somente leitura) //
		form.setEnabled("cpFlagCalculo", true);   // Habilita cpFlagCalculo //
		form.setEnabled("cpFlagKitFerias", true); // Habilita cpFlagKitFerias //
	}

	// Garante que o checkbox 'cpKitAssinado' esteja DESABILITADO em todas as atividades, EXCETO na 93
    if (atividade != ATIVIDADE_ASSINAR_KIT) {
        form.setEnabled("cpKitAssinado", false);
    }

	// Condição específica para a Atividade 93 (Assinar Kit Férias)
	if (atividade == 93) {
		form.setEnabled("cpKitAssinado", true);
		form.setEnabled("Ckb1", false);              // Mantém desabilitado (campo antigo)
		form.setEnabled("Ckb2", false);              // Mantém desabilitado (campo antigo)
		// Os outros campos necessários para a atividade 93 já estão sendo habilitados pelo loop principal:
		// cpParecerAssinatura, cpAprovarAvaliacao, cpParecerAvaliacao
	}

	// Garante que os outros checkboxes de controle (atividades 90 e 93) estejam desabilitados
	if (atividade == ATIVIDADE_GERAR_ARQUIVO) {
		form.setEnabled("cpFlagCadastro", false);
		form.setEnabled("cpFlagCalculo", false);
		form.setEnabled("cpFlagKitFerias", false);
		form.setEnabled("cpAnexoValidado", false);
		form.setEnabled("cpFeriasValidada", false);
		form.setEnabled("Ckb1", false);
		form.setEnabled("Ckb2", false);
	}

	// Condição específica para Atividades Iniciais (0 ou 4) ou Correção (9)
	if (atividade == 0 || atividade == 4 || atividade == 9) { //
		// Garante que os flags de controle do BPO estejam desabilitados
		form.setEnabled("cpFlagCadastro", false); //
		form.setEnabled("cpFlagCalculo", false); //
		form.setEnabled("cpFlagKitFerias", false); //
		// Garante que os checkboxes da atividade 93 estejam desabilitados
		form.setEnabled("cpAnexoValidado", false);
		form.setEnabled("cpFeriasValidada", false);
		form.setEnabled("Ckb1", false); // Garante desabilitação dos antigos
		form.setEnabled("Ckb2", false); // Garante desabilitação dos antigos
	}

	log.info("Fim do EnableFields do formulário FLUIG-0001 - FERIAS"); //

}