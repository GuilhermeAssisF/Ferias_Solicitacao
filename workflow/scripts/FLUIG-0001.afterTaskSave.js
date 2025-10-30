function afterTaskSave(colleagueId, nextSequenceId, userList) {

    log.info("--- [FLUIG-0001] Evento afterTaskSave (Solicitação de Férias) ---");

    // IDs das atividades
    var ATIVIDADE_CORRECAO = 9;       // Correção do Solicitante
    var ATIVIDADE_GERAR_KIT = 90;      // Gerar Kit Férias (BPO) - Destino da correção do RH
    var ATIVIDADE_VALIDAR_KIT_RH = 153; // Validar Kit Férias (RH) - Origem da correção

    var atividadeAtual = getValue("WKNumState");

    log.info("--- [FLUIG-0001] Atividade Atual: " + atividadeAtual);
    log.info("--- [FLUIG-0001] Próxima Sequência: " + nextSequenceId); // Log para depuração

    // Verifica APENAS se a atividade atual é a 153
    if (atividadeAtual == ATIVIDADE_VALIDAR_KIT_RH) {
        log.info("--- [FLUIG-0001] Verificando se é uma rejeição da Atividade 153 ---");

        // Pega o valor do campo de decisão e do parecer
        var decisaoRHKit = hAPI.getCardValue("cpAprovacaoValidacaoKit");
        var parecerRHKit = hAPI.getCardValue("cpParecerValidacaoKit");

        // Verifica se a decisão foi "Corrigir" (valor 2) e se há um parecer
        if (decisaoRHKit == "2" && parecerRHKit != null && parecerRHKit != "") {
            log.info("--- [FLUIG-0001] SIM, é uma rejeição com parecer. Enviando para o histórico. ---");

            try {
                 var usuarioAtual = fluigAPI.getUserService().getCurrent().getFullName();
                 var comentario = "Parecer RH (Validação Kit - Ativ. 153) por " + usuarioAtual + ": " + parecerRHKit;

                 log.info("--- [FLUIG-0001] Adicionando comentário: " + comentario);
                 // Adiciona o parecer ao histórico da tarefa
                 // Usar colleagueId fornecido pela função é mais seguro que getValue("WKUser") em eventos de servidor
                 hAPI.setTaskComments(colleagueId, getValue("WKNumProces"), 0, comentario); // 0 indica a instância atual do processo
            } catch (e) {
                 log.error("--- [FLUIG-0001] Erro ao obter usuário ou adicionar comentário ao histórico: " + e);
                 // Fallback: Adiciona comentário sem nome de usuário se API falhar
                 var comentarioErro = "Parecer RH (Validação Kit - Ativ. 153): " + parecerRHKit + " (Erro ao obter nome do usuário)";
                 try {
                     hAPI.setTaskComments(colleagueId, getValue("WKNumProces"), 0, comentarioErro);
                 } catch (e2) {
                     log.error("--- [FLUIG-0001] Erro grave ao tentar adicionar comentário de fallback: " + e2);
                 }
            }

        } else if (decisaoRHKit == "2") {
             log.warn("--- [FLUIG-0001] Rejeição da Ativ. 153, mas parecer está VAZIO. Nenhum comentário adicionado.");
        } else {
             log.info("--- [FLUIG-0001] Ação na Ativ. 153 não foi 'Corrigir' (Valor: " + decisaoRHKit + "). Nenhum comentário adicionado.");
        }
    }
    // ---- FIM DO BLOCO ----


    // Verifica se a tarefa que está sendo salva é a de "Correção da Solicitação" (Atividade 9)
    if (atividadeAtual == ATIVIDADE_CORRECAO) {

        // Pega o valor da decisão do solicitante (1 = Reencaminhar, 2 = Cancelar)
        var decisaoSolicitante = hAPI.getCardValue("cpReaberturaChamado"); // Usando o campo correto 'cpReaberturaChamado'
        log.info("--- [FLUIG-0001] Decisão do Solicitante na Correção (Ativ. " + ATIVIDADE_CORRECAO + "): " + decisaoSolicitante);

        // Se a decisão for "Reencaminhar", limpa os campos de pareceres anteriores
        if (decisaoSolicitante == "1") {
            log.info("--- [FLUIG-0001] Limpando campos de pareceres anteriores para nova avaliação. Processo: " + getValue("WKNumProces"));

            // 1. Limpa Campos - Aprovação Gestor
            hAPI.setCardValue("cpRespGestor", "");
            hAPI.setCardValue("cpAprovacaoGestor", "");
            // hAPI.setCardValue("cpParecercol", ""); // <<< VERIFICAR NOME CORRETO deste campo no HTML
            hAPI.setCardValue("cpParecerGestor", ""); // <<< Possível nome correto

            // 2. Limpa Campos - Aprovação Diretor
            hAPI.setCardValue("cpRespDiretor", "");
            hAPI.setCardValue("cpAprovacaoDiretor", "");
            hAPI.setCardValue("cpParecerAprovaDiretor", "");

            // 3. Limpa Campos - Validação Férias RH (Ativ 136)
            hAPI.setCardValue("cpRespRH", ""); // <<< VERIFICAR SE ESTE CAMPO AINDA É USADO
            hAPI.setCardValue("cpAprovacaoRH", ""); // <<< VERIFICAR SE ESTE CAMPO AINDA É USADO
            hAPI.setCardValue("cpParecerAprovaRH", ""); // <<< VERIFICAR SE ESTE CAMPO AINDA É USADO
            // Limpar campos da Atividade 136 diretamente
            hAPI.setCardValue("cpAprovarGestor3", "");
            hAPI.setCardValue("cpParecerGestor3", "");


            // 4. Limpa Campos - Analista BPO (Ativ 90)
            hAPI.setCardValue("cpAnalistaBPO", ""); // <<< VERIFICAR SE ESTE CAMPO AINDA É USADO
            hAPI.setCardValue("cpParecerBPO", ""); // <<< VERIFICAR SE ESTE CAMPO AINDA É USADO
            // Limpar campos da Atividade 90 diretamente
            hAPI.setCardValue("cpFlagCalculo", ""); // Desmarca flag
            hAPI.setCardValue("cpFlagKitFerias", ""); // Desmarca flag
            hAPI.setCardValue("cpParecerProcessamento", ""); // Limpa parecer

             // 5. Limpa Campos - Validação Kit RH (Ativ 153)
             hAPI.setCardValue("cpAprovacaoValidacaoKit", "");
             hAPI.setCardValue("cpAnexosValidadosKit", "");
             hAPI.setCardValue("cpParecerValidacaoKit", "");

             // 6. Limpar Campos - Assinar Kit (Ativ 93) - Opcional, mas recomendado
             hAPI.setCardValue("cpKitAssinado", ""); // Desmarcar flag
             // hAPI.setCardValue("cpAprovarAvaliacao", ""); // Limpar avaliação, se necessário
             // hAPI.setCardValue("cpParecerAvaliacao", ""); // Limpar parecer da avaliação

        }
    }

    // Limpa campos da Atividade 153 quando BPO (90) envia para Validação RH (153)
    // (Esta lógica parece correta como estava)
    if (atividadeAtual == ATIVIDADE_GERAR_KIT && nextSequenceId == ATIVIDADE_VALIDAR_KIT_RH) {
        log.info("--- [FLUIG-0001] Limpando campos da Atividade " + ATIVIDADE_VALIDAR_KIT_RH + " ao avançar da Atividade " + ATIVIDADE_GERAR_KIT);
        hAPI.setCardValue("cpAprovacaoValidacaoKit", "");
        hAPI.setCardValue("cpAnexosValidadosKit", ""); // Desmarcar o checkbox
        hAPI.setCardValue("cpParecerValidacaoKit", "");
    }

    log.info("--- [FLUIG-0001] FIM Evento afterTaskSave ---");
}