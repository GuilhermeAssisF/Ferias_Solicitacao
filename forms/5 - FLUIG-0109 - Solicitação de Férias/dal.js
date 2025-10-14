/*FUNCOES RELACIONADAS AS INTEGRACOES DO FORMULARIO*/
var ZoomFactory = function(zoomConfig) {
	var newZoom = new Zoom();
	
	for (prop in zoomConfig) {
		if (zoomConfig.hasOwnProperty(prop)) {
			newZoom[prop] = zoomConfig[prop];
		}
	}
	
	return newZoom;
};


var ZoomConfigs = {
	

	
	// historico da Afastamentos
	HistAfastamentos: {
		Titulo: "Busca Histórico Afastamentos",
		FieldsName: ['cpMatricula','cpColigada'],			 
		Id: "IDzoomAfastamento",
		DataSet: "DS_FLUIG_0001",
		Colunas: [
				  			{"title" : "Coligada", "name" : "CODCOLIGADA"},
	                        {"title" : "Chapa", "name" : "CHAPA"},
	                        {"title" : "Início Afastamento", "name" : "INICIO_AFASTAMENTO"},
	                        {"title" : "Final Afastamento", "name" : "FINAL_AFASTAMENTO"},
	                        {"title" : "Tipo", "name" : "TIPO"},
	                        {"title" : "Motivo", "name" : "MOTIVO"},
	                        {"title" : "Dias", "name" : "DIAS"}
		],
		Retorno: function(retorno) {
			
		}
	},
	// historico da Faltas
	HistFaltas: {
		Titulo: "Busca Histórico Faltas",
		FieldsName: ['cpMatricula','cpColigada'],			 
		Id: "IDzoomFaltas",
		DataSet: "DS_FLUIG_0003",
		Colunas: [
				  			{"title" : "Coligada", "name" : "CODCOLIGADA"},
	                        {"title" : "Chapa", "name" : "CHAPA"},
	                        {"title" : "Quantidade Faltas", "name" : "QTD_FALTAS"},
	                        {"title" : "Quantidade Estorno", "name" : "QTD_ESTORNO"},
	                        {"title" : "Ano Competência", "name" : "ANOCOMP"},
	                        {"title" : "Mês Competência", "name" : "MESCOMP"}
		],
		Retorno: function(retorno) {
			
		}
	},
	
	
	// historico da Períodos
	HistPeriodos: {
		Titulo: "Busca Histórico Períodos",
		FieldsName: ['cpMatricula','cpColigada'],			 
		Id: "IDzoomPeriodos",
		DataSet: "DS_FLUIG_0002",
		Colunas: [
		          			{"title" : "Coligada", "name" : "CODCOLIGADA"},
	                        {"title" : "Chapa", "name" : "CHAPA"},	
	                        {"title" : "Início Período", "name" : "INICIO_PERIODO"},
	                        {"title" : "Fim Período", "name" : "FINAL_PERIODO"},
	                        {"title" : "Saldo", "name" : "SALDO"},
	                        {"title" : "Período Aberto", "name" : "PERIO_DOABERTO"},
	                        {"title" : "Período Perdido", "name" : "PERIO_DOPERDIDO"}
		],
		Retorno: function(retorno) {
			
			
		}
	},
	// historico da situacao
	Histsituacao: {
		Titulo: "Historico Situacao",
		FieldsName: ['cpMatricula','cpColigada'],		
		Id: "IDzoomMuniEstado",
		DataSet: "DS_FLUIG_0004",
		Colunas: [
				  			{"title" : "Coligada", "name" : "CODCOLIGADA"},
	                        {"title" : "Chapa", "name" : "CHAPA"},
	                        {"title" : "Data Mudanca", "name" : "DATAMUDANCA"},
	                        {"title" : "Motivo", "name" : "MOTIVO"},
	                        {"title" : "Nova Situacao", "name" : "NOVASITUACAO"}
		],
		Retorno: function(retorno) {
			
		}
	},
	// Liquido de ferias
	LiquidFerias: {
		Titulo: "Busca Líquido de Férias",
		FieldsName: ['cpColigada','cpMatricula','cpFimPeriodoAquisitivo'],			 
		Id: "IDzoomLiqFerias",
		DataSet: "DS_FLUIG_0005",
		Colunas: [
		          			{"title" : "Coligada", "name" : "CODCOLIGADA"},
	                        {"title" : "Chapa", "name" : "CHAPA"},	
	                        {"title" : "Evento", "name" : "EVENTO"},
	                        {"title" : "Tipo Evento", "name" : "TIPO_EVENTO"},
	                        {"title" : "Quantidade", "name" : "QUANTIDADE"},
	                        {"title" : "Valor", "name" : "VALOR"},
	                        {"title" : "Data Pagamento", "name" : "DATA_PAGTO"},
	                        {"title" : "Líquido", "name" : "LIQUIDO_FERIAS"}
		],
		Retorno: function(retorno) {
			
		}
	}
}

	




























