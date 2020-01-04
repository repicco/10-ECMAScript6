class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    
    validarDados(){
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem('id') //null
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        //JSON.stringify para transformar Objeto em JSON 
        //ex Obj > {preco: 1, valor: 2}
        //ex JSON > '{"preco": 1, "valor": 2}' 
        //JSON.parse para retornar JSON ao Objeto

        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))
        
        localStorage.setItem('id', id)
    }
}

let bd = new Bd()

function cadastrarDespesa(){

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor =  document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    
    if(despesa.validarDados()){
        bd.gravar(despesa)
        //dialog Sucesso
        document.getElementById('modal_titulo').innerHTML = 'Sucesso na gravação!'
        document.getElementById('modal_text').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa inserida com sucesso!' 
        document.getElementById('modal_botao').innerHTML = 'Ok'
        document.getElementById('modal_botao').className = 'btn btn-success'

        $('#modalRegistraDespesa').modal('show')
    } else {
        //dialog Erro
        document.getElementById('modal_titulo').innerHTML = 'Erro na gravação'
        document.getElementById('modal_text').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Existem campos obrigatórios que não foram preenchidos'  
        document.getElementById('modal_botao').innerHTML = 'Voltar e Corrigir'
        document.getElementById('modal_botao').className = 'btn btn-danger'

        $('#modalRegistraDespesa').modal('show')
        
    }
    
}