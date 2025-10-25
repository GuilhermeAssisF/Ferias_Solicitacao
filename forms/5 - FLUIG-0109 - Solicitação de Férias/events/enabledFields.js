function enableFields(form) {

	log.info("INICIO do EnableFields do formulário FLUIG-0001 - FERIAS"); //

	var atividade = parseInt(getValue("WKNumState")); //

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
		{ "campo": "cpParecerAssinatura", "atividade": "93" }, //
		{ "campo": "cpAprovarAvaliacao", "atividade": "93" }, // Habilitado para avaliação
		{ "campo": "cpParecerAvaliacao", "atividade": "93" }, // Habilitado para avaliação
		// { "campo": "Ckb1", "atividade": "93" }, // Removido
		// { "campo": "Ckb2", "atividade": "93" }, // Removido

		//GERAR O KIT (BPO)
		{ "campo": "cpParecerProcessamento", "atividade": "90" }, //
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
			// Adicionada verificação para não desabilitar indevidamente campos não listados (como os novos checkboxes)
			// nas atividades posteriores
			if (atividade != 0 && atividade != 4 && atividade != 9) {
				var campoEstaNaLista = Campos.some(function (c) { return c.campo === Campo.campo; });
				if (campoEstaNaLista) {
					form.setEnabled(Campo["campo"], false); // Desabilita o campo se ele estiver na lista Campos
				}
			} else {
				// Nas atividades iniciais/correção, desabilita apenas os campos que NÃO pertencem a elas
				if (atividades.indexOf(atividade.toString()) < 0) {
					form.setEnabled(Campo["campo"], false);
				}
			}
		}
	}

	// --- TRATAMENTOS ESPECÍFICOS POR ATIVIDADE ---

	// Condição específica para a Atividade 90 (BPO)
	if (atividade == 90) { //
		form.setEnabled("cpFlagCadastro", false); // Mantém cpFlagCadastro desabilitado (somente leitura) //
		form.setEnabled("cpFlagCalculo", true);   // Habilita cpFlagCalculo //
		form.setEnabled("cpFlagKitFerias", true); // Habilita cpFlagKitFerias //
	}

	// Condição específica para a Atividade 93 (Validar Kit Férias)
	if (atividade == 153) {
		form.setEnabled("cpAnexoValidado", false);  // Começa desabilitado (JS do formulário habilita após clique no botão)
		form.setEnabled("cpFeriasValidada", false); // << ALTERADO AQUI para começar desabilitado também
        form.setEnabled("Ckb1", false);              // Garante que Ckb1 (antigo) está desabilitado
        form.setEnabled("Ckb2", false);              // Garante que Ckb2 (antigo) está desabilitado
        // Outros campos como cpParecerAssinatura, cpAprovarAvaliacao, cpParecerAvaliacao já foram habilitados pelo loop
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