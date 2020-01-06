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

    recuperarTodosRegistros() {
        //array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++){
            //recuperar as despesas
            let despesa = JSON.parse(localStorage.getItem(i))

            //existem indices pulados/removidos
            //pular indices nulos

            if(despesa === null){
                continue
            }            

            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa){
        let despesasFiltradas = Array()
        
        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesasFiltradas)
        console.log(despesa)

        //ano
        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter( f => f.ano == despesa.ano)
        }
        
        //mes
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter( f => f.mes == despesa.mes)
        }

        //dia
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter( f => f.dia == despesa.dia)
        }

        //tipo
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter( f => f.tipo == despesa.tipo)
        }

        //descricao
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter( f => f.descricao == despesa.descricao)
        }

        //valor
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter( f => f.valor == despesa.valor)
        }
        
        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
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

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

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


function carregaListaDespesas(despesas = Array(), filtro = false){
    
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }
    
     //selecionando o elemento tbody
     let listaDespesas = document.getElementById('listaDespesas')
     listaDespesas.innerHTML = ''
     /*
     <tr>
         <td>15/03/2018</td> -> 0
         <td>Alimentação</td> -> 1
         <td>Compras do Mês</td> -> 2
         <td>444.75</td> -> 3
     </tr>
     */
 
     //percorrer o array despesas, listando cada despesa de forma dinamica
     despesas.forEach(function(d){
         //criar linha <tr>
         let linha = listaDespesas.insertRow()
 
         //criar as colunas <td>
         linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
         
         //ajustar o tipo
            switch(d.tipo) {
                 case '1': d.tipo = 'Alimentação'
                     break
              case '2': d.tipo = 'Educação'
                     break
                 case '3': d.tipo = 'Lazer'
                     break
                 case '4': d.tipo = 'Saúde'
                     break
                 case '5': d.tipo = 'Transporte'
                     break
             }
         linha.insertCell(1).innerHTML = d.tipo
 
         linha.insertCell(2).innerHTML = d.descricao
         linha.insertCell(3).innerHTML = d.valor

        //criar botão de exclusão por linha
        let btn =  document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            //recuperar o id this.id            
            //tratar o id do btn
            let id = this.id.replace('id_despesa_', '')

            //remover a despesa
            bd.remover(id)

            //atualizar a pagina para retirar o form
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        //gerar Total
        let total = 0

        //valida em despesas o total
        despesas.forEach(function(item){
            total += Number(item.valor)
            vTotal = total
        })
        
        
        document.getElementById('total').innerHTML = `Total: ${vTotal}`
        

     })
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)

}