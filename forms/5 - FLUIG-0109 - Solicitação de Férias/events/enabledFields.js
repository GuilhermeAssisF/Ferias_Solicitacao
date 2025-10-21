function enableFields(form) {

	log.info("INICIO do EnableFields do formulário FLUIG-0001 - FERIAS");

	var atividade = parseInt(getValue("WKNumState"));

	// Array definindo quais campos são editáveis em quais atividades.
	var Campos = new Array(
		// --- ATIVIDADES 0, 4, 9 (Início e Correção do Solicitante) ---
		{ "campo": "cpSolicitacaoPara", "atividade": "0,4,9" }, // *** GARANTIR QUE ESTEJA HABILITADO ***
		{ "campo": "cpHaveraAbono", "atividade": "0,4,9" },
		{ "campo": "cpAntecipar13Salario", "atividade": "0,4,9" },
		// {"campo": "cpHaveraSubstituto", "atividade": "0,4,9" }, // Descomente se for editável
		{ "campo": "cpObs", "atividade": "0,4,9" },

		// --- ATIVIDADE 9 (Reabertura/Correção do Solicitante) ---
		{ "campo": "cpAprovacaoSolicitante", "atividade": "9" },
		{ "campo": "cpParecerAprovacaoSolicitante", "atividade": "9" },

		// --- ATIVIDADE 14 (Gestor Imediato) ---
		{ "campo": "cpAprovarGestor", "atividade": "14" },
		{ "campo": "cpParecerGestor", "atividade": "14" },

		// --- ATIVIDADE 20 (Gestor Imediato em Atraso / Diretoria) ---
		{ "campo": "cpAprovarGestor2", "atividade": "20" },
		{ "campo": "cpParecerGestor2", "atividade": "20" },

		// --- ATIVIDADE 93 (Assinar Kit Férias - Solicitante) ---
		{ "campo": "Ckb1", "atividade": "93" },
		{ "campo": "Ckb2", "atividade": "93" },
		{ "campo": "cpParecerAssinatura", "atividade": "93" },
        // { "campo": "cpAprovarAvaliacao", "atividade": "93"},   // Descomente se usar avaliação
        // { "campo": "cpParecerAvaliacao", "atividade": "93"},   // Descomente se usar avaliação

		// --- ATIVIDADE 90 (Gerar Kit - Analista BPO) ---
		{ "campo": "cpParecerProcessamento", "atividade": "90" },
        { "campo": "cpFlagCalculo", "atividade": "90"},
        { "campo": "cpFlagKitFerias", "atividade": "90"}, // Será desabilitado inicialmente pela condição específica

		// --- ATIVIDADES 136, 153 (RH - Validar Férias / Validar Kit) ---
		{ "campo": "cpAprovarGestor3", "atividade": "136,153" },
		{ "campo": "cpParecerGestor3", "atividade": "136,153" }
	);

    // --- LÓGICA PRINCIPAL DE HABILITAR/DESABILITAR ---
	// Primeiro, desabilita TODOS os campos (exceto pai-filho e WK)
	var allFields = form.getCardData();
	var it = allFields.keySet().iterator();
	while (it.hasNext()) {
		var key = it.next();
		if (key.indexOf("___") == -1 && key.indexOf("WK") != 0) {
             // Use try/catch para segurança caso getValue retorne algo inesperado
             try {
                if (form.getValue(key) != null) { // Verifica indiretamente a existência
                    form.setEnabled(key, false);
                }
             } catch(e) {
                log.warn("Erro ao tentar desabilitar campo '" + key + "': " + e);
             }
		}
	}

	// Segundo, habilita APENAS os campos listados no array 'Campos' para a atividade ATUAL
	for (var item in Campos) {
		var Campo = Campos[item];
		var atividades = Campo["atividade"].split(",");
        var nomeCampo = Campo["campo"];

		// Se a atividade atual ESTÁ na lista de atividades do campo...
		if (atividades.indexOf(atividade.toString()) >= 0) {
            // Verifica se o campo existe antes de habilitar
            if (form.getValue(nomeCampo) != null) { // Usando getValue != null como verificação
			    form.setEnabled(nomeCampo, true); // Habilita o campo
            } else {
                 log.warn("Campo '" + nomeCampo + "' listado para habilitar não foi encontrado via getValue.");
            }
		}
        // Não precisa de 'else' aqui, pois todos já foram desabilitados no loop anterior
	}


    // --- LÓGICAS ESPECÍFICAS PÓS-LOOP (Ajustes finos) ---

	// Atividade 90 (Gerar Kit - BPO): Garante que 'cpFlagCadastro' fique desabilitado e 'cpFlagKitFerias' comece desabilitado
    if (atividade == 90) {
        form.setEnabled("cpFlagCadastro", false);
        form.setEnabled("cpFlagKitFerias", false); // Garante que comece DESABILITADO (JS cliente habilita depois)
        // cpFlagCalculo foi habilitado pelo loop acima
    }

	// Atividade Inicial (0 ou 4): Garante que as flags de controle estejam desabilitadas (redundante, mas seguro)
    if (atividade == 0 || atividade == 4) {
        form.setEnabled("cpFlagCadastro", false);
        form.setEnabled("cpFlagCalculo", false);
        form.setEnabled("cpFlagKitFerias", false);
    }

	// Garante que os campos ocultos V (dos checkboxes Ckb1, Ckb2) nunca sejam editáveis
    form.setEnabled("Ckb1V", false);
    form.setEnabled("Ckb2V", false);


	log.info("Fim do EnableFields do formulário FLUIG-0001 - FERIAS");
}