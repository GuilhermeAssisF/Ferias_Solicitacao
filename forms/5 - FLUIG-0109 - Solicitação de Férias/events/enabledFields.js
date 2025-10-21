function enableFields(form) {

	log.info("INICIO do EnableFields do formulário FLUIG-0001 - FERIAS");

	var atividade = parseInt(getValue("WKNumState"));

	var Campos = new Array(
		//inicio e correcao
		{ "campo": "cpSolicitacaoPara", "atividade": "0,4,9" },
		{ "campo": "cpHaveraAbono", "atividade": "0,4,9" },
		{ "campo": "cpAntecipar13Salario", "atividade": "0,4,9" },
		{ "campo": "cpHaveraSubstituto", "atividade": "0,4,9" },
		{ "campo": "cpObs", "atividade": "0,4,9" },

		//REABERTURA
		{ "campo": "cpAprovacaoSolicitante", "atividade": "9" },
		{ "campo": "cpParecerAprovacaoSolicitante", "atividade": "9" },
		//GESTOR IMEDIATO
		{ "campo": "cpAprovarGestor", "atividade": "14" },
		{ "campo": "cpParecerGestor", "atividade": "14" },
		//GESTOR IMEDIATO EM ATRASO
		{ "campo": "cpAprovarGestor2", "atividade": "20" },
		{ "campo": "cpParecerGestor2", "atividade": "20" },
		//VALIDAR O KIT
		{ "campo": "cpParecerAssinatura", "atividade": "93" },
		{ "campo": "Ckb1", "atividade": "93" },
		{ "campo": "Ckb2", "atividade": "93" },
		/*{"campo" : "Ckb1","atividade" : "93"}, 
		{"campo" : "Ckb2","atividade" : "93"}, */
		//GERAR O KIT
		{ "campo": "cpParecerProcessamento", "atividade": "90" },
		//validar ferias rh
		{ "campo": "cpAprovarGestor3", "atividade": "153" },
		{ "campo": "cpParecerGestor3", "atividade": "153" },
		//validar ferias rh
		{ "campo": "cpAprovarGestor3", "atividade": "136" },
		{ "campo": "cpParecerGestor3", "atividade": "136" }

	);

	for (var item in Campos) {
		var Campo = Campos[item],
			atividades = Campo["atividade"].split(",");

		if (atividades.indexOf(atividade.toString()) >= 0) {
			form.setEnabled(Campo["campo"], true);

		} else {
			form.setEnabled(Campo["campo"], false);
		}
	}

	// Condição específica para a Atividade 90 (BPO) - Mantém cpFlagCadastro desabilitado
    if (atividade == 90) {
        form.setEnabled("cpFlagCadastro", false);
        // Habilita os outros flags se precisar que o BPO os marque:
        form.setEnabled("cpFlagCalculo", true);
        form.setEnabled("cpFlagKitFerias", true);
    }

	// Adicione esta condição específica para a Atividade Inicial (0 ou 4)
    // Usamos || para cobrir ambos os casos de atividade inicial (0 ou 4)
    if (atividade == 0 || atividade == 4) {
        // Garante que os flags de controle estejam desabilitados na atividade inicial
        form.setEnabled("cpFlagCadastro", false);
        form.setEnabled("cpFlagCalculo", false);
        form.setEnabled("cpFlagKitFerias", false);
    }

	log.info("Fim do EnableFields do formulário FLUIG-0001 - FERIAS");

}