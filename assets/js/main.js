(function ($){
  'use strict';

   const app = (function(){
     return {
       'iteracao': 0,
       init: function init(){
         this.initEvents();
       },
       initEvents: function initEventsl(){
          $('[data-js="submit-form"]').on('submit',this.handleEventSubmit);
          $('[data-js="submit-simplex"]').on('submit', this.structModel);
       },
        handleEventSubmit: function handleEventSubmit(event) {
          event.preventDefault();
          let formSimplex = $('[data-js="submit-form"]').get();
          let formSimplexSubmit = $('[data-js="submit-simplex"]').get();
          let numberVariables = $('[data-js="variaveis"]').get().value;
          let numberRestrictions = $('[data-js="restricoes"]').get().value;
          if(numberRestrictions ==='selecione' || numberVariables === 'selecione'){
            alert('Por favor selecione número de variáveis e restrições!');
            return app.handleLocationReload(event)
          }
          formSimplexSubmit.appendChild(app.insertFormObject(numberVariables));
          formSimplexSubmit.appendChild(app.insertFormRestriction(numberRestrictions, numberVariables));
          app.cancelModel(formSimplex);
        },
        handleLocationReload: function handleLocationReload(event) {
          event.preventDefault();
          window.location.reload();
        },
        cancelModel: function cancelModel() {
          let formSimplex = $('[data-js="submit-form"]').get();
          let buttonModelar = $('[data-js="button-submit"]').get();
          let garbage = formSimplex.removeChild(buttonModelar);

          formSimplex.insertAdjacentHTML('afterend', '<button class="button-submit buttonCancel" data-js="buttonCancel">Cancelar</button>');
          $('[data-js="buttonCancel"]').on('click',this.handleLocationReload);
        },
        structModel: function structModel(event) {
          event.preventDefault();
          let numberRestrictions = $('[data-js="restricoes"]').get().value;
          let numberVariables = $('[data-js="variaveis"]').get().value;
          let arrayObjetForm = [];
          let arrayRestriction = [];
          let arrayRestrictionPart = [];
          $('[data-js="inputs-values"]').forEach(function(item) {
            arrayObjetForm.push(Number(item.value))
          });
          $('[data-js="input-restriction"]').forEach(function(item) {
            arrayRestrictionPart.push(Number(item.value))
          });
          let remove = Number(numberVariables);
          let aux = [];
            for(let i = 0; i < numberRestrictions; i++){
              aux = arrayRestrictionPart.splice(0,remove);
              arrayRestriction.push(aux);
          }
          app.optimizeModel(arrayObjetForm, arrayRestriction);

          //remove button otimizar
          let formSimplexSubmit = $('[data-js="submit-simplex"]').get();
          let buttonOptimum = $('[class="button-submit buttonOptimum"]').get();
          let garbage = formSimplexSubmit.removeChild(buttonOptimum);

        },
        optimizeModel: function optimizeModel(arrayObjetForm, arrayRestriction) {
            let numberRestrictions = $('[data-js="restricoes"]').get().value;
            let objetivo = arrayObjetForm;
            let restriction = arrayRestriction;
            let arrayFinalRestriction = [];
            objetivo = app.insertValuesObject(objetivo);
            let arrayAux = [];
            let matrizIdentidade = [];
              for( let i = 0; i < numberRestrictions; i++) {
                for(let j= 0; j < numberRestrictions; j++){
                   i === j ? arrayAux.push(1) : arrayAux.push(0);
                 }
                 restriction[i] = restriction[i].concat(arrayAux);
                 restriction[i].unshift(0);
                 arrayAux = [];

                let inputConvert = Number($('[data-js="input-restriction-res"]').get(i).value);
                restriction[i].push(inputConvert);
            }
            //agora
            let aux;
            let aux2;
            if(app.iteracao === 0) {
             app.iteracao++
              aux = restriction;
              aux2 = objetivo;
             aux.unshift(aux2)
             console.log(aux)
             app.createTable(aux);
           }

           restriction.shift();
           console.log(restriction);
            let response = app.calculateObject(objetivo, restriction);
            console.log(app.newCalculateObject(response));

        },
        calculateObject: function calculateObject(objetivo, restriction) {
          let numberRestrictions = $('[data-js="restricoes"]').get().value;
          let numberVariables =  $('[data-js="variaveis"]').get().value;
          let auxCalc = Number(numberRestrictions) + 1
            let maiorValorAbsoluto=0;
            let indexVarSai = 0;
            let varSai = 0;
            let menorVarSai = 0;
            let varSaiAux = 0;
            let varSaiFinal = 0;
            let pivo = 0;
            let indexLinhaPivo = 0;
            let linhaPivo = [];
            let novaLinhaPivo = [];
            let arrayVarSai = [];
              objetivo.forEach(function(item, index){
                if(maiorValorAbsoluto > item){
                  maiorValorAbsoluto = item;
                  indexVarSai = index;
                }
              });

              let pivoAux =0;
              for(let i = 0; i < numberRestrictions; i++) {
                restriction[i].forEach(function(item, index){
                  let b = restriction[i][ (restriction[i].length - 1) ];
                  let c = restriction[i][indexVarSai];
                    varSai = b / c;
                });
                  if(varSai > 0)
                  arrayVarSai.push(varSai);
                }
                menorVarSai = arrayVarSai[0];
                arrayVarSai.forEach(function(item,index){
                  if( menorVarSai >= item){
                    menorVarSai = item;
                    pivo = restriction[index][indexVarSai];
                    linhaPivo = restriction[index];
                    indexLinhaPivo = index;
                  }
                });

              novaLinhaPivo = linhaPivo.map(item => item/pivo);

              let arrayAll = [];
              let linha = [];

              arrayAll.push(objetivo);

              for(let i = 0; i < numberRestrictions; i++) {
                arrayAll.push(restriction[i]);
              }

              for(let i = 0; i < auxCalc; i++) {
                  let itemVarSai = arrayAll[i][indexVarSai];
                  if(arrayAll[i] === linhaPivo){
                    arrayAll[i] = novaLinhaPivo;
                  }
                  else{
                      if(itemVarSai < 0 && itemVarSai !== -1) {
                        itemVarSai = itemVarSai*(-1);
                      }
                      else if(itemVarSai >1) {
                        itemVarSai = itemVarSai*(-1);
                      }
                      else if(itemVarSai > 0 && itemVarSai < 1) {
                        itemVarSai = itemVarSai*(-1);
                      }
                      else if(itemVarSai === 0) {
                        itemVarSai = 0;
                      }
                      else if(itemVarSai === 1){
                        itemVarSai = -1;
                      }
                      else if(itemVarSai === -1){
                        itemVarSai = 1;
                      }
                      let aux =  novaLinhaPivo.map(item => item*itemVarSai);
                      for(let j= 0; j < novaLinhaPivo.length; j++) {
                        aux[j] = (aux[j] + arrayAll[i][j]);
                      }
                      arrayAll[i] = aux;
                  }
              }
              console.log(indexVarSai + ' ' + indexLinhaPivo);
              app.inAndOut(indexVarSai, indexLinhaPivo);
              console.log(arrayAll)
              // app.createTable(indexLinhaPivo, indexVarSai,arrayAll)
               app.createTable(arrayAll)

              return arrayAll;
              // console.log(pivo);
              // console.log(linhaPivo);
              // console.log(novaLinhaPivo);
              // console.log(maiorValorAbsoluto);
              // console.log(indexVarSai);
              // console.log(varSaiFinal);
              console.log(arrayAll);
        },
        newCalculateObject: function newCalculateObject(arrayAll) {
            let arrayAllOriginal = arrayAll;
            let newObjective = arrayAll[0];
            let newRestriction = arrayAll.shift();

            let iteracao = newObjective.some(function(item){
              return item < 0;
            })
            if(iteracao === true) {
              return app.calculateObject(newObjective,arrayAll);
            }
            return arrayAllOriginal;
        },
        insertValuesObject: function insertValuesObject (objetivo) {
          let numberRestrictions = $('[data-js="restricoes"]').get().value;
          let limit =  Number(numberRestrictions) + 1;
          for(let i = 0; i < limit; i++) {
            objetivo.push(0);
          }
          let arr = objetivo.map(function(item){
              if(item > 0) {
                return  item = item * (-1);
              }
              if(item < 0)
                return item = item* (-1);

              if(item === 0){
                return item = 0;
              }
          });
          arr.unshift(1);
          return arr;
        },
        insertFormObject: function insertFormObject(numberVariables) {
          let fragment = document.createDocumentFragment();
          let labelMax = document.createElement('label');
          labelMax.textContent = 'Max. Z =';
          labelMax.setAttribute('class','label-form-object')
          fragment.appendChild(labelMax);
          for(let i = 0; i < numberVariables; i++){
              let input = document.createElement('input');
              input.setAttribute('class','input-form-object');
              input.setAttribute('type', 'number');
              input.setAttribute('id','object'+[i]);
              input.setAttribute('data-js', 'inputs-values');
              let label = document.createElement('label');
              label.setAttribute('class','label-form-object');
              label.setAttribute('for','object'+[i])
              label.textContent = 'x'+[i+1];
              fragment.appendChild(input);
              fragment.appendChild(label);
          }
          return fragment;
        },
        insertFormRestriction: function insertFormRestriction(numberRestrictions, numberVariables) {
          let fragment = document.createDocumentFragment();
          let labelRestrict = document.createElement('label');
          labelRestrict.textContent = 'Sujeito a restrições:';
          labelRestrict.setAttribute('class', 'subject');
          fragment.appendChild(labelRestrict);

          for(let i = 0; i < numberRestrictions ; i++) {
            let div = document.createElement('div');
            div.setAttribute('class', 'row-block');
            for(let j = 0; j < numberVariables; j++) {
              let input = document.createElement('input');
              input.setAttribute('class','input-form-object');
              input.setAttribute('type', 'number');
              input.setAttribute('id','object'+[j]);
              input.setAttribute('data-js', 'input-restriction')
              let label = document.createElement('label');
              label.setAttribute('class','label-form-object');
              label.setAttribute('for','object'+[j]);
              label.textContent = 'x'+[j+1];

              div.appendChild(input);
              div.appendChild(label);

              if((j + 1) === +numberVariables) {
                let lessOrEqual = document.createElement('label');
                lessOrEqual.textContent = '≤';
                lessOrEqual.setAttribute('class','label-form-object lessOrEqual');
                div.appendChild(lessOrEqual);
                let inputb = document.createElement('input');
                inputb.setAttribute('class', 'input-form-object ');
                inputb.setAttribute('type', 'number');
                inputb.setAttribute('data-js','input-restriction-res');
                div.appendChild(inputb)
              }
            }
            fragment.appendChild(div);
          }
          let buttonOptimum = document.createElement('button');
          buttonOptimum.textContent = 'Otimizar'
          buttonOptimum.setAttribute('class', 'button-submit buttonOptimum');
          fragment.appendChild(buttonOptimum);

          return fragment;
        },
        inAndOut: function inAndOut(indexVarSai, indexLinhaPivo){
          let entra = indexVarSai;
          let sai = indexLinhaPivo + 1;
          let form = $('[data-js="submit-simplex"]').get();
          let p = document.createElement('p');
          p.setAttribute('data-js', 'inAndOut');
          p.textContent = 'Entra na base: ' + 'X'+entra +'|'+'Sai da base: ' + 'Xf'+sai;
          form.appendChild(p);
        },
        createTable: function createTable ( arrayAll) {
          let numberRestrictions = $('[data-js="restricoes"]').get().value;
          let numberVariables =  $('[data-js="variaveis"]').get().value;
          let arrayAllOriginal = arrayAll;

          let fragment = document.createDocumentFragment();

          let table = document.createElement('table');
          table.setAttribute('data-js', 'table');
          let tableIndex = $('[data-js="table"]').get();
          let thead = document.createElement('thead');
          let tbody = document.createElement('tbody');
          let tfoot = document.createElement('tfoot');
          let form = $('[data-js="submit-simplex"]').get();

          let tr = document.createElement('tr');
          let z = document.createElement('td');
          z.textContent = 'Z';
          tr.appendChild(z);
          for(let i = 0; i < numberVariables; i++) {
            let td = document.createElement('td')
            td.textContent = 'X'+(i+1);
            tr.appendChild(td);
          }
          thead.appendChild(tr);

          for(let i = 0; i < numberRestrictions; i++) {
              let td = document.createElement('td');
              td.textContent = 'Xf'+(i+1);
              tr.appendChild(td);
          }
          let b = document.createElement('td');
          b.textContent = 'b';
          tr.appendChild(b);
          thead.appendChild(tr);

          for(let i =0; i < arrayAll.length; i++) {
            let trBody = document.createElement('tr')
              for(let j= 0; j < arrayAll[i].length; j++) {
                let td = document.createElement('td');
                td.textContent = ''+arrayAll[i][j];
                trBody.appendChild(td);
              }
              tbody.appendChild(trBody);
          }
          table.appendChild(thead);
          table.appendChild(tbody);
          form.appendChild(table);
          return arrayAllOriginal;
        }
     }
   })();

   app.init();

})(DOM);
