var INTEGRACAO = 83; //INTEGRA NA ATIVIDADE 24 DE apos o PROCESSAMENTO DE FERIAS
var ATIVIDADE_GERAR_KIT = 90; // GERAR KIT FERIAS (BPO)
var ATIVIDADE_VALIDAR_KIT_RH = 153; // VALIDAR KIT FERIAS (RH)

function beforeStateEntry(sequenceId){

	var atividadeAnterior = getValue("WKPrevState"); // Pega a atividade de onde o fluxo está vindo
	
	if(sequenceId==INTEGRACAO){
		CadastraFerias();
	}

	// Verifica se está entrando na atividade de Gerar Kit Férias (BPO)
    if (sequenceId == ATIVIDADE_GERAR_KIT) {
        log.info("--- [FLUIG-0001] Entrando na atividade Gerar Kit Férias (90) ---");

        // Verifica se a flag 'Kit Férias' já está marcada (indicando um retorno para correção)
        // Checkboxes marcados geralmente têm o valor "on" no servidor.
        var flagKitFeriasAtual = hAPI.getCardValue("cpFlagKitFerias");
        log.info("--- [FLUIG-0001] Valor atual cpFlagKitFerias: '" + flagKitFeriasAtual + "'");

        if (flagKitFeriasAtual == "on") {
            log.info("--- [FLUIG-0001] Desmarcando cpFlagKitFerias devido ao retorno para correção. Processo: " + getValue("WKNumProces"));
            // Define o valor do campo como vazio ("") para desmarcar o checkbox
            hAPI.setCardValue("cpFlagKitFerias", "");
        }
    }

}

function CadastraFerias() { //

    log.info("--- [FLUIG-0001] Iniciando CadastraFerias ---");
    var retorno = true;
    var xml;

    var formatoInput = new java.text.SimpleDateFormat("dd/MM/yyyy");
    var formatoOutput = new java.text.SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");

    var xmlFerias = "";

    // Pega valores do formulário
    var tipoAbono = hAPI.getCardValue("cpHaveraAbono"); //
    var somenteAbono = (tipoAbono == "3");
    var InicioFerias = hAPI.getCardValue("cpDataInicioFerias"); //
    var FimFerias = hAPI.getCardValue("cpDataFimFerias"); //
    var DiasFerias = hAPI.getCardValue("cpDiasFerias"); //
    var Dtpagto = hAPI.getCardValue("cpDtPagto"); //
    // var InicioPerAqui = hAPI.getCardValue("cpInicioPeriodoAquisitivo"); // Não usado diretamente no XML
    var FimPerAqui = hAPI.getCardValue("cpFimPeriodoAquisitivo"); //
    var chapa = hAPI.getCardValue("cpMatricula"); //
    var Coligada = hAPI.getCardValue("cpColigada"); //
    var Abono = hAPI.getCardValue("cpDiasAbono"); //
    var Antecipar13Salario = hAPI.getCardValue("cpAntecipar13Salario"); //

    // Inicializa variáveis de data formatada
    var DtinicioFormatada2 = null;
    var DtFimFormatada2 = null;
    var DTAvisoFer2 = null; // Data do Aviso
    var DtPagamentoFormatada2 = null; // Data de Pagamento
    var DtFimAquiFormatada2 = null; // Fim Período Aquisitivo

    log.info("Tipo Abono: " + tipoAbono + ", Somente Abono: " + somenteAbono);
    log.info("Data Início Raw: " + InicioFerias);
    log.info("Data Fim Raw: " + FimFerias);

    try {
        // Formata Data Pagamento (Sempre necessária)
        if (Dtpagto != null && Dtpagto != "") {
            var DtPagamento = formatoInput.parse(Dtpagto);
            var DtPagamentoFormatada = formatoOutput.format(DtPagamento);
            DtPagamentoFormatada2 = DtPagamentoFormatada.replace("T12","T00"); //
            log.info("Ferias DtPagamentoFormatada: " + DtPagamentoFormatada2);
        } else {
             log.warn("Data de Pagamento está vazia.");
             // Considerar lançar erro se for obrigatória
        }

        // Formata Fim Período Aquisitivo (Sempre necessária)
        if (FimPerAqui != null && FimPerAqui != "") {
            var DtFimAqui = formatoInput.parse(FimPerAqui);
            var DtFimAquiFormatada = formatoOutput.format(DtFimAqui);
            DtFimAquiFormatada2 = DtFimAquiFormatada.replace("T12","T00"); //
            log.info("Ferias DtFimAquiFormatada: " + DtFimAquiFormatada2);
        } else {
            log.warn("Fim Período Aquisitivo está vazio.");
             // Considerar lançar erro se for obrigatório
        }

        // --- INÍCIO DO BLOCO CONDICIONAL MOVIDO ---
        // Formata datas de Férias e calcula Data Aviso APENAS SE NÃO FOR "Somente Abono"
        if (!somenteAbono) {
            if (InicioFerias != null && InicioFerias != "" && FimFerias != null && FimFerias != "") {
                log.info("Formatando datas de Início, Fim e Aviso...");
                // início de ferias
                var DtInicio = formatoInput.parse(InicioFerias);
                var DtinicioFormatada = formatoOutput.format(DtInicio);
                DtinicioFormatada2 = DtinicioFormatada.replace("T12","T00"); //
                log.info("Ferias DtinicioFormatada: " + DtinicioFormatada2);

                // fim de ferias
                var DtFim = formatoInput.parse(FimFerias);
                var DtFimFormatada = formatoOutput.format(DtFim);
                DtFimFormatada2 = DtFimFormatada.replace("T12","T00"); //
                log.info("Ferias DtFimFormatada: " + DtFimFormatada2);

                // DATA DO AVISO DE FERIAS (Calculada a partir do Início)
                var dateAviso = formatoInput.parse(InicioFerias);
                dateAviso.setDate(dateAviso.getDate() - 30);
                var DatadePagamentoAviso = formatoInput.format(dateAviso);
                var DTAVISO = formatoInput.parse(DatadePagamentoAviso);
                var DTAvisoFer = formatoOutput.format(DTAVISO);
                DTAvisoFer2 = DTAvisoFer.replace("T12","T00"); //
                log.info("Ferias DTAvisoFer2 (Calculada): " + DTAvisoFer2);
            } else {
                log.warn("Datas de Início ou Fim de Férias estão vazias, mas não é 'Somente Abono'. Aviso não será calculado.");
                // Considerar lançar erro se as datas forem obrigatórias neste cenário
            }
        } else { // Caso seja somenteAbono
            log.info("É 'Somente Abono'. Definindo DiasFerias como 0 e pulando formatação de datas de férias/aviso.");
            DiasFerias = "0"; // Garante que DiasFerias seja 0
        }
        // --- FIM DO BLOCO CONDICIONAL ---

    } catch (dateError) {
        log.error("Erro ao formatar datas em CadastraFerias: " + dateError);
        throw "Erro ao processar as datas informadas ("+ dateError.message +"). Verifique os formatos."; // Lança erro amigável
    }

    // Define flags booleanas/numéricas
    var temAbono = (tipoAbono == '1' || tipoAbono == '3') ? "1" : "0"; //
    var Antecipar13 = (Antecipar13Salario == 1 && !somenteAbono) ? "1" : "0"; //


    // Monta o XML
    xmlFerias += ' <PFUFeriasPer>';
    xmlFerias += '<CODCOLIGADA>'+Coligada+'</CODCOLIGADA>';
    xmlFerias += ' <CHAPA>'+chapa+'</CHAPA>';
    if (DtFimAquiFormatada2 != null) xmlFerias += '<FIMPERAQUIS>'+DtFimAquiFormatada2+'</FIMPERAQUIS>'; else log.warn("XML: FIMPERAQUIS omitido por ser nulo.");
    if (DtPagamentoFormatada2 != null) xmlFerias += '<DATAPAGTO>'+DtPagamentoFormatada2+'</DATAPAGTO>'; else log.warn("XML: DATAPAGTO omitido por ser nulo.");
    if (DtinicioFormatada2 != null) xmlFerias += '<DATAINICIO>'+DtinicioFormatada2+'</DATAINICIO>'; else log.info("XML: DATAINICIO omitido (Somente Abono ou data vazia).");
    if (DtFimFormatada2 != null) xmlFerias += '<DATAFIM>'+DtFimFormatada2+'</DATAFIM>'; else log.info("XML: DATAFIM omitido (Somente Abono ou data vazia).");
    if (DTAvisoFer2 != null) xmlFerias += '<DATAAVISO>'+DTAvisoFer2+'</DATAAVISO>'; else log.info("XML: DATAAVISO omitido (Somente Abono ou data vazia).");
    xmlFerias += '<SITUACAOFERIAS>M</SITUACAOFERIAS>';
    xmlFerias += ' <NRODIASFERIAS>'+ (DiasFerias != null ? DiasFerias : "0") +'</NRODIASFERIAS>'; // Usa 0 se DiasFerias for null
    xmlFerias += '<NRODIASABONO>'+ (Abono != null ? Abono : "0") +'</NRODIASABONO>'; // Usa 0 se Abono for null
    xmlFerias += '<NRODIASFERIASCORRIDOS>0.00</NRODIASFERIASCORRIDOS>';
    xmlFerias += '<NRODIASABONOCORRIDOS>0.00</NRODIASABONOCORRIDOS>';
    xmlFerias += '<POSICAOABONO>'+temAbono+'</POSICAOABONO>';
    xmlFerias += '<IMAGEMSITUACAO>Marcadas</IMAGEMSITUACAO>';
    xmlFerias += '<PAGA1APARC13O>'+Antecipar13+'</PAGA1APARC13O>';
    xmlFerias += '</PFUFeriasPer>';

    log.info("@xmlFerias diz: xmlFerias Montado: " + xmlFerias);

    // Conexão e chamada do Web Service (sem alterações aqui)
    var CONNECT = DatasetFactory.getDataset("ds_connector", null, null, null);
	var USUARIO = CONNECT.getValue(0,"INTEGRADOR");
	var SENHA = CONNECT.getValue(0, "SENHA");
	var NOME_SERVICO = "WSDATASERVER";
	var CAMINHO_SERVICO = "com.totvs.WsDataServer";

	var servico = ServiceManager.getServiceInstance(NOME_SERVICO);

	var serviceHelper = servico.getBean();
	var instancia = servico.instantiate(CAMINHO_SERVICO);

	var ws = instancia.getRMIwsDataServer();

	var authenticatedService = serviceHelper.getBasicAuthenticatedClient(ws, "com.totvs.IwsDataServer", USUARIO, SENHA);

    try {
        var result = authenticatedService.saveRecordEmail('FopFuFeriasPerDataBR', xmlFerias, 'CODCOLIGADA=' + Coligada + ';CODSISTEMA=P', "suportesoter@consultoriainterativa.com.br");
        log.info("@xmlFerias Cadastro diz: RESULT: " + result);

        if ((result != null) && (result.indexOf("===") != -1)) {
            var msgErro = result.substring(0, result.indexOf("==="));
            log.error("Erro retornado pelo Web Service RM: " + msgErro);
            throw msgErro; // Lança o erro específico do RM
        } else {
             log.info("Web Service RM executado sem retornar erro explícito.");
        }
    }
    catch (e) {
        var mensagemErro = "Falha na comunicação/execução do Web Service RM: " + e;
        log.error(mensagemErro + " ---> XML enviado: " + xmlFerias);
        // Não definir retorno = false aqui, lançar a exceção é melhor
        throw mensagemErro; // Lança a exceção para interromper o fluxo e notificar o Fluig
    }

    log.info("--- [FLUIG-0001] Finalizando CadastraFerias com sucesso ---");
    return retorno; // Retorna true se chegou até aqui sem exceções
}