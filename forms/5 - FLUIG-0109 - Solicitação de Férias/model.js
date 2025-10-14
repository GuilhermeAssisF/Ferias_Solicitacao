var Model = (function() 
{
	var load_Holiday = function(dataset, filter) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, null);
        return Compartilhados.setCacheDataSet(dataset, null, datasetReturn);
    };
	
	var load_DS0003 = function(dataset, filter) 
	{
		var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	
	var load_DS0006 = function(dataset) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, null);
        return Compartilhados.setCacheDataSet(dataset, null, datasetReturn);
    };
	
	
	 var load_DS0007 = function(dataset, login)
    {
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [login]);
        return Compartilhados.setCacheDataSet(dataset, login, datasetReturn);
    };
	
	var load_DS0008 = function(dataset) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, null);
        return Compartilhados.setCacheDataSet(dataset, null, datasetReturn);
    };
	
	var load_DS0012 = function(dataset, login) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [login]);
        return Compartilhados.setCacheDataSet(dataset, login, datasetReturn.values[0]);
    };
	
	var load_DS0013 = function(dataset, filter) 
	{
        var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	
	var load_DS0031 = function(dataset) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, null);
        return Compartilhados.setCacheDataSet(dataset, null, datasetReturn);
    };
	
	var load_DS0032 = function(dataset, codigo) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [codigo]);
        return Compartilhados.setCacheDataSet(dataset, codigo, datasetReturn.values);
    };
	
	var load_DS0054 = function(dataset, obra) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [obra]);
        return Compartilhados.setCacheDataSet(dataset, obra, datasetReturn.values);
    };
	
	var load_DS0057 = function(dataset, palavra) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [palavra]);
        return Compartilhados.setCacheDataSet(dataset, palavra, datasetReturn.values);
    };
	
	var load_DS0063 = function(dataset, filter) 
	{
		var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn.values);
    };
	
	var load_DS0064 = function(dataset, filter) 
	{
		var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	
	var load_DS0065 = function(dataset, filter) 
	{
		var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1],filtros[2]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	
	var load_DS0075 = function(dataset, cpf) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [cpf]);
        return Compartilhados.setCacheDataSet(dataset, cpf, datasetReturn.values);
    };
	
	var load_DS0131 = function(dataset, obra) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [obra]);
        return Compartilhados.setCacheDataSet(dataset, obra, datasetReturn);
    };
	
	var load_DS0132 = function(dataset, filter) 
	{
        var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1], filtros[2]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	
	var load_DS0133 = function(dataset) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, null);
        return Compartilhados.setCacheDataSet(dataset, null, datasetReturn);
    };
	
	var load_DS0135 = function(dataset) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, null);
        return Compartilhados.setCacheDataSet(dataset, null, datasetReturn);
    };
	
	var load_DS0139 = function(dataset, cnpj) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [cnpj]);
        return Compartilhados.setCacheDataSet(dataset, cnpj, datasetReturn);
    };
	var load_DS0141 = function(dataset, filter) 
	{
        var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	var load_DS0142 = function(dataset, filter) 
	{
        var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	var load_DS0143 = function(dataset, filter) 
	{
        var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	var load_DS0144 = function(dataset, filter) 
	{
        var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	var load_DS0145 = function(dataset, filter) 
	{
        var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1], filtros[2]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	var load_DS0152 = function(dataset, filter) 
	{
        var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	var load_DS0157 = function(dataset, filter) 
	{
        var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	
	var load_DS0182 = function(dataset, codigo_obra) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [codigo_obra]);
        return Compartilhados.setCacheDataSet(dataset, codigo_obra, datasetReturn);
    };
	
	var load_DS0183 = function(dataset, codigo_empresa) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [codigo_empresa]);
        return Compartilhados.setCacheDataSet(dataset, codigo_empresa, datasetReturn);
    };
	
	var load_DS0191 = function(dataset, codigo_processo) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [codigo_processo]);
        return Compartilhados.setCacheDataSet(dataset, codigo_processo, datasetReturn.values);
    };
	
	var load_DS0192 = function(dataset) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, null);
        return Compartilhados.setCacheDataSet(dataset, null, datasetReturn);
    };
	
	var load_DS0196 = function(dataset, filter) 
	{
		var filtros = filter.split('_');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	
	var load_DS0199 = function(dataset) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, null);
        return Compartilhados.setCacheDataSet(dataset, null, datasetReturn);
    };
	
	var load_DS0200 = function(dataset) 
	{
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, null);
        return Compartilhados.setCacheDataSet(dataset, null, datasetReturn);
    };
	
	var load_DS1000 = function(dataset, filter) 
	{
		var filtros = filter.split('|');
        var datasetReturn = Compartilhados.searchCustomDataset(dataset, [filtros[0], filtros[1]]);
        return Compartilhados.setCacheDataSet(dataset, filter, datasetReturn);
    };
	
	 return {
		get_Holiday: function() 
        {
            return Compartilhados.defaultGetDataSet('globalCalendar', null, load_Holiday);
        },
		get_DS0003: function(chapa,coligada) 
        {
			var filter = chapa+'_'+coligada;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0003', filter, load_DS0003);
        },
		get_DS0006: function() 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0006', null,load_DS0006);
        },
		get_DS0007: function(login)
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0007', login, load_DS0007);
        },
		get_DS0008: function() 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0008', null,load_DS0008);
        },
        get_DS0012: function(login) 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0012', login, load_DS0012);
        },
		get_DS0013: function(secao,coligada) 
        {
			var filter = secao+'_'+coligada;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0013', filter, load_DS0013);
        },
		get_DS0031: function() 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0031', null,load_DS0031);
        },
		get_DS0032: function(codigo) 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0032', codigo, load_DS0032);
        },
		get_DS0054: function(obra) 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0054', obra, load_DS0054);
        },
		get_DS0057: function(palavra) 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0057', palavra, load_DS0057);
        },
		get_DS0063: function(coligada,secao) 
        {
			var filter = coligada+'_'+secao;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0063', filter, load_DS0063);
        },
		get_DS0064: function(empresa,obra) 
        {
			var filter = empresa+'_'+obra;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0064', filter, load_DS0064);
        },
		get_DS0065: function(empresa,obra,produto) 
        {
			var filter = empresa+'_'+obra+'_'+produto;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0065', filter, load_DS0065);
        },
		get_DS0075: function(cpf) 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0075', cpf, load_DS0075);
        },
		get_DS0131: function(obra) 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0131', obra, load_DS0131);
        },
		get_DS0132: function(numero_contrato,codigo_empresa,codigo_obra) 
        {
			var filter = numero_contrato+'_'+codigo_empresa+'_'+codigo_obra;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0132', filter, load_DS0132);
        },
		get_DS0133: function(obra) 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0133', null, load_DS0133);
        },
		get_DS0135: function() 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0135', null,load_DS0135);
        },
		get_DS0139: function(cnpj) 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0139', cnpj, load_DS0139);
        },
		get_DS0141: function(chapa,coligada) 
        {
			var filter = chapa+'_'+coligada;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0141', filter, load_DS0141);
        },
		get_DS0142: function(chapa,coligada) 
        {
			var filter = chapa+'_'+coligada;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0142', filter, load_DS0142);
        },
		get_DS0143: function(chapa,coligada) 
        {
			var filter = chapa+'_'+coligada;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0143', filter, load_DS0143);
        },
		get_DS0144: function(chapa,coligada) 
        {
			var filter = chapa+'_'+coligada;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0144', filter, load_DS0144);
        },
		get_DS0145: function(coligada,chapa,dataFimPeriodoAquisitivo) 
        {
			var filter = coligada+'_'+chapa+'_'+dataFimPeriodoAquisitivo;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0145', filter, load_DS0145);
        },
		get_DS0152: function(chapa,coligada) 
        {
			var filter = chapa+'_'+coligada;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0152', filter, load_DS0152);
        },
		get_DS0157: function(numero_contrato,codigo_empresa) 
        {
			var filter = numero_contrato+'_'+codigo_empresa;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0157', filter, load_DS0157);
        },
		get_DS0182: function(codigo_obra) 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0182', codigo_obra, load_DS0182);
        },
		get_DS0183: function(codigo_empresa) 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0183', codigo_empresa, load_DS0183);
        },
		get_DS0191: function(codigo_processo) 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0191', codigo_processo, load_DS0191);
        },
		get_DS0192: function() 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0192', null,load_DS0192);
        },
		get_DS0196: function(coligada,secao) 
        {
			var filter = coligada+'_'+secao;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0196', filter, load_DS0196);
        },
		get_DS0199: function() 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0199', null,load_DS0199);
        },
		get_DS0200: function() 
        {
            return Compartilhados.defaultGetDataSet('DS_FLUIG_0200', null,load_DS0200);
        },
		get_DS1000: function(procedure, parametros) 
        {
			var filter = procedure+'|'+parametros;
            return Compartilhados.defaultGetDataSet('DS_FLUIG_1000', filter,load_DS1000);
        },
    };

})();