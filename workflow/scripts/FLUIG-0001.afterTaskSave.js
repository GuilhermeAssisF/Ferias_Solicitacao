function afterTaskSave(colleagueId, nextSequenceId, userList) {

    log.info("--- [FLUIG-0001] Evento afterTaskSave (Solicitação de Férias) ---");

    // CONFIRME O ID da atividade de "Correção do Solicitante" no seu diagrama de processo
    var ATIVIDADE_CORRECAO = 9; // Ajustado com base no fluxo usual
    var ATIVIDADE_GERAR_KIT = 90;
    var ATIVIDADE_VALIDAR_KIT_RH = 153;
    var atividadeAtual = getValue("WKNumState");

    log.info("--- [FLUIG-0001] Atividade Atual: " + atividadeAtual);

    // Verifica se a tarefa que está sendo salva é a de "Correção da Solicitação"
    if (atividadeAtual == ATIVIDADE_CORRECAO) {

        // Pega o valor da decisão do solicitante (1 = Reencaminhar, 2 = Cancelar)
        //
        var decisaoSolicitante = hAPI.getCardValue("cpReaberturaChamado");
        log.info("--- [FLUIG-0001] Decisão do Solicitante na Correção: " + decisaoSolicitante);

        // Se a decisão for "Reencaminhar", limpa os campos de pareceres anteriores
        if (decisaoSolicitante == "1") {
            log.info("--- [FLUIG-0001] Limpando campos de pareceres anteriores para nova avaliação. Processo: " + getValue("WKNumProces"));

            // 1. Limpa Campos - Aprovação Gestor
            hAPI.setCardValue("cpRespGestor", "");
            hAPI.setCardValue("cpAprovacaoGestor", "");
            hAPI.setCardValue("cpParecercol", "");

            // 2. Limpa Campos - Aprovação Diretor
            hAPI.setCardValue("cpRespDiretor", "");
            hAPI.setCardValue("cpAprovacaoDiretor", "");
            hAPI.setCardValue("cpParecerAprovaDiretor", "");

            // 3. Limpa Campos - Folha RH
            hAPI.setCardValue("cpRespRH", "");
            hAPI.setCardValue("cpAprovacaoRH", "");
            hAPI.setCardValue("cpParecerAprovaRH", "");

            // 4. Limpa Campos - Analista BPO
            hAPI.setCardValue("cpAnalistaBPO", "");
            hAPI.setCardValue("cpParecerBPO", "");
        }
    }

    if (atividadeAtual == ATIVIDADE_GERAR_KIT && nextSequenceId == ATIVIDADE_VALIDAR_KIT_RH) {
        // Limpa os campos da atividade 153
        hAPI.setCardValue("cpAprovacaoValidacaoKit", "");
        hAPI.setCardValue("cpAnexosValidadosKit", "");
        hAPI.setCardValue("cpParecerValidacaoKit", "");
    }
}