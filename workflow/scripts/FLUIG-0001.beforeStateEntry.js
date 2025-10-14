var INTEGRACAO = 83; //INTEGRA NA ATIVIDADE 24 DE apos o PROCESSAMENTO DE FERIAS

function beforeStateEntry(sequenceId){
	
	if(sequenceId==INTEGRACAO){
		CadastraFerias();
	}
}

function CadastraFerias(){

	var retorno =true;
	var xml;

	var formatoInput = new java.text.SimpleDateFormat("dd/MM/yyyy");
	var formatoOutput = new java.text.SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");

	var xml ="";
	var xmlCalcula="";
	var xmlFerias="";
	var xmlFeriasRecibo="";

//	inicio de ferias
	var InicioFerias = hAPI.getCardValue("cpDataInicioFerias");
	var DtInicio = formatoInput.parse(InicioFerias);
	var DtinicioFormatada = formatoOutput.format(DtInicio);
	log.info("Ferias DtinicioFormatada" + DtinicioFormatada);
	var DtinicioFormatada2 = DtinicioFormatada.replace("T12","T00");


//	DATA DE PAGAMENTO
	var Dtpagto = hAPI.getCardValue("cpDtPagto");
	var DtPagamento = formatoInput.parse(Dtpagto);
	var DtPagamentoFormatada = formatoOutput.format(DtPagamento);
	log.info("Ferias DtPagamentoFormatada" + DtPagamentoFormatada);
	var DtPagamentoFormatada2 = DtPagamentoFormatada.replace("T12","T00");

//	fim de ferias 
	var FimFerias = hAPI.getCardValue("cpDataFimFerias");
	var DtFim = formatoInput.parse(FimFerias);
	var DtFimFormatada = formatoOutput.format(DtFim);
	var DtFimFormatada2 = DtFimFormatada.replace("T12","T00");
	log.info("Ferias DtFimFormatada" + DtFimFormatada);


//	inicio de periodo aquisitivo
	var InicioPerAqui = hAPI.getCardValue("cpInicioPeriodoAquisitivo");
	var DtPErAqui = formatoInput.parse(InicioPerAqui);
	var DtinicioPerAquiForm = formatoOutput.format(DtPErAqui);
	log.info("Ferias DtinicioPerAquiForm" + DtinicioPerAquiForm);

//	fim de periodo aquisitivo
	var FimPerAqui = hAPI.getCardValue("cpFimPeriodoAquisitivo");
	var DtFimAqui = formatoInput.parse(FimPerAqui);
	var DtFimAquiFormatada = formatoOutput.format(DtFimAqui);
	var DtFimAquiFormatada2 = DtFimAquiFormatada.replace("T12","T00");
	log.info("Ferias DtFimAquiFormatada" + DtFimAquiFormatada);


	var chapa = hAPI.getCardValue("cpMatricula");
	var Coligada = hAPI.getCardValue("cpColigada"); 
	var DiasFerias = hAPI.getCardValue("cpDiasFerias");
	var Abono = hAPI.getCardValue("cpDiasAbono"); 
	var HaveraAbono = hAPI.getCardValue("cpHaveraAbono"); 
	var Antecipar13Salario = hAPI.getCardValue("cpAntecipar13Salario"); 
	
	var temAbono;
	if(HaveraAbono==1){
		temAbono="1";
	}else{
		temAbono="0";
	}
	
	var Antecipar13;
	if(Antecipar13Salario==1){
		Antecipar13="1";
	}else{
		Antecipar13="0";
	}
	
	var Ferias = InicioFerias.substring(3,5)+'/'+InicioFerias.substring(0,2)+'/'+InicioFerias.substring(6,10);
	log.info("Andre Ferias2 "+Ferias);
	var date = new Date(Ferias);
	date.setDate(date.getDate() - 30);
	var dia = date.getDate();
	if(parseFloat(dia)<parseFloat(10)){
		dia = '0'+dia;
	}else{
		dia = dia;
	}
	log.info("Andre dia "+dia);
	var mes = date.getMonth();
	mes = mes+1;
	if(parseFloat(mes)<parseFloat(10)){
	mes = '0'+mes;
	}else{
	mes = mes;
	}
	log.info("Andre mes "+mes);
	var ano = date.getFullYear();
	var DatadePagamento = (dia+'/'+mes+'/'+ano);
//	DATA DO AVISO DE FERIAS
	
	var DTAVISO = formatoInput.parse(DatadePagamento);
	var DTAvisoFer = formatoOutput.format(DTAVISO);
	var DTAvisoFer2 = DTAvisoFer.replace("T12","T00");
	log.info("Ferias DTAvisoFer2" + DTAvisoFer2);

//	preenche dados de ferias 

	xmlFerias +=' <PFUFeriasPer>';
	xmlFerias +='<CODCOLIGADA>'+Coligada+'</CODCOLIGADA>';
	xmlFerias +=' <CHAPA>'+chapa+'</CHAPA>';
	xmlFerias +='<FIMPERAQUIS>'+DtFimAquiFormatada2+'</FIMPERAQUIS>';
	xmlFerias +='<DATAPAGTO>'+DtPagamentoFormatada2+'</DATAPAGTO>';
	xmlFerias +='<DATAINICIO>'+DtinicioFormatada2+'</DATAINICIO>';
	xmlFerias +='<DATAFIM>'+DtFimFormatada2+'</DATAFIM>';
	xmlFerias +='<DATAAVISO>'+DTAvisoFer2+'</DATAAVISO>';
	xmlFerias +='<SITUACAOFERIAS>M</SITUACAOFERIAS>';
	xmlFerias +=' <NRODIASFERIAS>'+DiasFerias+'</NRODIASFERIAS>';
	xmlFerias +='<NRODIASABONO>'+Abono+'</NRODIASABONO>';
	xmlFerias +='<NRODIASFERIASCORRIDOS>0.00</NRODIASFERIASCORRIDOS>';
	xmlFerias +='<NRODIASABONOCORRIDOS>0.00</NRODIASABONOCORRIDOS>';
	xmlFerias +='<POSICAOABONO>'+temAbono+'</POSICAOABONO>';
	xmlFerias +='<IMAGEMSITUACAO>Marcadas</IMAGEMSITUACAO>';
	xmlFerias +='<PAGA1APARC13O>'+Antecipar13+'</PAGA1APARC13O>';
	xmlFerias +='</PFUFeriasPer>';

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


	log.info("@xmlFerias diz: xmlFerias: " + xmlFerias);

	try
	{
		var result = authenticatedService.saveRecordEmail('FopFuFeriasPerDataBR', xmlFerias, 'CODCOLIGADA=' + Coligada + ';CODSISTEMA=P',"suportesoter@consultoriainterativa.com.br");

		if ((result != null) && (result.indexOf("===") != -1))
		{
			var msgErro = result.substring(0, result.indexOf("==="));
			throw msgErro;

		}
		else
		{
		}
	}
	catch (e)
	{
		if (e == null)
		{
			e = "Erro desconhecido; verifique o log do AppServer";
		}

		var mensagemErro = "Erro na comunicação com o TOTVS TBC: " + e;
		log.error(mensagemErro + " ---> " + xmlFerias);
		throw mensagemErro;
	}

	log.info("@xmlFerias Cadastro diz: RESULT: " + result);

	return retorno;
}


