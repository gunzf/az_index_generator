    var clienteSelecionado = "Cliente";
    var codDoProjSelecionado = "00000";
    var nomeDoProjSelecionado = "Titulo do Projeto";
    // obter o elemento div com o ID "my-div"
    var myDiv = document.getElementById("folderDataTextarea");
    // obter o elemento select com o ID "dropCliente"
    var dropDownClient = document.getElementById("dropCliente");
    var codDoProjeto = document.getElementById("codDoProjeto");
    var nomeDoProjeto = document.getElementById("nomeDoProjeto");
    var botaoAssets = document.getElementById("botaoAssets");
    var tipoDeProjeto = document.getElementById("selectType");
    var saveFunc = document.getElementById("saveFunc");

    // definir o código HTML a ser inserido na div
    
    function liberarBotao(){
      if (dropDownClient.value&&codDoProjeto.value&&nomeDoProjeto.value != null){
          botaoAssets.classList.remove("disabled");
      }
      else {
        botaoAssets.classList.add("disabled");
      } 
      return null;
    }

    function selectTypeFunction(){
      if (tipoDeProjeto.value == 2){
        extractFolderDataBanner();
        saveFunc.classList.remove("disabled");
      } else if(tipoDeProjeto.value == 1) {
        extractFolderDataEmail();
        saveFunc.classList.remove("disabled");
      }
    }

    tipoDeProjeto.addEventListener("change", function() {
      console.log(tipoDeProjeto.value);
    });

    dropDownClient.addEventListener("change", function() {
        // obter o valor do elemento option selecionado
      var novoCliente = myDiv.value.replace(clienteSelecionado, dropDownClient.value);
      clienteSelecionado = dropDownClient.value;
      //myDiv.value = novoCliente;
      console.log(dropDownClient.value);
      //dropDownClient.disabled = "true";
      liberarBotao();
    });

    codDoProjeto.addEventListener("change", function() {
      // obter o valor do elemento option selecionado
      var novoCodigo = myDiv.value.replace(codDoProjSelecionado, codDoProjeto.value);
      codDoProjSelecionado = codDoProjeto.value;
      //myDiv.value = novoCodigo;
      console.log(codDoProjeto.value);
      //codDoProjeto.disabled= "true";
      liberarBotao();

    });

    nomeDoProjeto.addEventListener("change", function() {
      // obter o valor do elemento option selecionado
      var novoNome = myDiv.value.replace(nomeDoProjSelecionado, nomeDoProjeto.value);
      nomeDoProjSelecionado = nomeDoProjeto.value;
      //myDiv.value = novoNome;
      console.log(nomeDoProjeto.value);
      //nomeDoProjeto.disabled= "true";
      liberarBotao();

    });

  let folderData = [];

  function dropHandler(event) {
    event.preventDefault();

    // Obtém os arquivos e pastas arrastados
    const items = event.dataTransfer.items;
    const folderPromises = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        folderPromises.push(traverseFileTree(item));
      }
    }

    Promise.all(folderPromises).then(folders => {
      const output = document.getElementById('output');
      output.innerHTML = '';

      folders.forEach(folder => {
        const folderCard = document.createElement('div');
        folderCard.className = 'folder-card mt-4 mb-4';

        const folderName = document.createElement('h5');
        folderName.textContent = folder.name;
        folderCard.appendChild(folderName);

        const fileList = document.createElement('ul');
        folder.files.forEach(file => {
          const fileName = document.createElement('li');
          fileName.textContent = file.name;
          fileList.appendChild(fileName);
        });

        folderCard.appendChild(fileList);

        //const dropdown = createDropdown(folder.name); // Passa o nome da pasta como parâmetro
        //folderCard.appendChild(dropdown);

        //output.appendChild(folderCard);

        if (tipoDeProjeto.value == 2){
          console.log("Escolheu Banner");

          //const dropdown = createDropdown(folder.name); // Passa o nome da pasta como parâmetro
          //folderCard.appendChild(dropdown);
          output.appendChild(folderCard);
          folderData.push({ folderName: folder.name, /*dropdownValue: dropdown.value*/ });
        } else if (tipoDeProjeto.value == 1) {
          console.log("Escolheu Emkt");

          const emkturl = createUrlLink(folder.name); // Passa o nome da pasta como parâmetro
          folderCard.appendChild(emkturl);
          output.appendChild(folderCard);
          folderData.push({ folderName: folder.name, urlValue: emkturl.value });
        }

        //folderData.push({ folderName: folder.name, dropdownValue: dropdown.value }); // Armazena nome da pasta e escolha selecionada
      });
    });
  }

  function dragOverHandler(event) {
    event.preventDefault();
  }

  function traverseFileTree(item, path = '') {
    return new Promise((resolve, reject) => {
      if (item.isFile) {
        item.file(file => {
          resolve({ name: item.name, files: [file] });
        });
      } else if (item.isDirectory) {
        const folderReader = item.createReader();
        const folderFiles = [];

        folderReader.readEntries(entries => {
          const promises = [];

          for (let i = 0; i < entries.length; i++) {
            promises.push(traverseFileTree(entries[i], `${path}${item.name}/`));
          }

          Promise.all(promises).then(files => {
            files.forEach(folder => {
              folderFiles.push(...folder.files);
            });

            resolve({ name: `${path}${item.name}`, files: folderFiles });
          });
        });
      } else {
        reject(new Error('Item não suportado.'));
      }
    });
  }

/*   function createDropdown(folderName) {
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';

    const select = document.createElement('select');
    select.className = 'dropdown-select'; // Adiciona uma classe ao elemento select
    select.innerHTML = `
      <option value="quad">quad</option>
      <option value="vert">vert</option>
      <option value="hori">hori</option>
      <option value="hori-g">hori-g</option>
      <option value="not">not</option>
    `;
  
      dropdown.appendChild(select);
      
      return dropdown;
    

  } */

  function createUrlLink(folderName) {
    const urlLink = document.createElement('div');
    urlLink.className = 'div-link-emkt';
    urlLink.setAttribute("width", "100%");

    const inputurl = document.createElement('input');
    inputurl.className = 'linkurl-input'; // Adiciona uma classe ao elemento input
    inputurl.setAttribute("type", "text");
    inputurl.setAttribute("onclick", "this.value=''");
    inputurl.setAttribute("width", "100%");
    inputurl.setAttribute("value", "Insira o link do e-mail aqui.");
    inputurl.setAttribute("style", "width: 100%;");
  
      urlLink.appendChild(inputurl);
      
      return urlLink;
    

  }

  //Funcao para Banner

  function extractFolderDataBanner() {

    const resultContainer = document.getElementById('resultContainer');
    const folderDataTextarea = document.getElementById('folderDataTextarea');
    //folderDataTextarea.value = '';
    let result = '';

    resultContainer.innerHTML = '';

    folderData.forEach(data => {
      const folderName = data.folderName;
      const dropdownValue = getDropdownValue(folderName);

      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.textContent = `Folder: ${folderName}, Dropdown Value: ${dropdownValue}`;

      resultContainer.appendChild(resultItem);

      const extractedName = extractName(folderName);
      const extractedWH = extractWidthAndHeight(folderName).slice(-2);
      const extractedOnlyName = extractOnlyName(folderName);

      result += `
  <div class="grid py-2">
    <div>${nomeDoProjSelecionado}</div>
      <div>${extractedWH[0]}x${extractedWH[1]}px</div>
      <div data-banner="${folderName}/index.html" data-width="${extractedWH[0]}" data-height="${extractedWH[1]}" class="btn btn-basic showBanner">Veja a peça</div>
      <a target="_blank" href="${extractedOnlyName}.jpg" class="btn btn-basic">Veja layout</a>
  </div>
`;
    });

    const htmlCodeInicio = `
<!doctype html>
<html>
<head>
<meta charset='UTF-8'><meta name='viewport' content='minimum-scale=1.0, maximum-scale=1.0, width=device-width, user-scalable=no'/>
<title>Arizona</title>
<link rel='stylesheet'type='text/css'href='https://digital.arizona.com.br/Web/clientes/assets-geral/css/bootstrap.css'>
<link rel='stylesheet'type='text/css'href='https://digital.arizona.com.br/Web/clientes/assets-geral/css/style.css'>
<style type="text/css">

  .showCase {
    background: #272727;
    top: 100px;
  }

  .content-banner {
    padding-top: 8px;
  }

  .content-banner .box-banner {
    top: 40px;
  }

  .AZ-close{
    top: 10px;
  }

  #format{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    color: #ffffff;
  }


  .grid {
    grid-template-columns: 25% 25% 25% 25%
  }

  @media (max-width: 990px) {
    .grid {
      grid-template-columns: 25% 25% 25% 25%
    }

    .dis-none {
      display: none !important;
    }
  }

  #prev {
    width: 0;
    height: 0;
    overflow: hidden;
  }

  @media (min-width: 990px) {
    .content-banner.not {
      margin: 0 auto;
      top: 20px;
      max-width: 1260px;
    }
  }

  .apresentacao {
    width: 200px;
    height: auto;
    padding: 10px 15px;
    display: block;
    margin-top: 30px;
    margin-bottom: 50px;
    border-radius: 15px;
    outline: 1px solid black;
    text-align: center;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  .apresentacao a {
    color: black;
    text-decoration: none;
  }

  .apresentacao:hover {
    background: #cacaca;
  }
</style>
</head>
<body>`;
    var htmlCodeTitulo = `
<div class='container-fluid' id='topHeader'>
  <div class='content mt-2 mb-2 header'>
    <div class='row p-2'>
      <div class='logo col-md-2 col-3' >
        <img src='https://digital.arizona.com.br/Web/clientes/assets-geral/img/logo-2020.png' alt=''>
      </div>
      <div class='titulo-desc col-md-10 col-9'>${clienteSelecionado} | ${codDoProjSelecionado} | ${nomeDoProjSelecionado}
      </div>
    </div>
  </div>
</div>
<div class='showCase' onclick='resetExpand()'>
  <div class='AZ-close'>X</div>
  <div class='content-banner'>
    <div class='box-banner'></div>
  </div>
</div>
<div class='content px-2'>
  <div class='grid py-2' id='menu-nav'>
    <div>Criativo</div>
    <div>Formato</div>
    <div>Link html</div>
    <div>Layout Aprovado</div>
  </div>
    `;
    const htmlCodeArquivos = "";
    closeScript = "</scr" + "ipt>";
    const htmlCodeFinal =` 
  <!-- JS -->
  <script src='https://digital.arizona.com.br/Web/clientes/assets-geral/js/jquery.js'>${closeScript}
  <script src='https://digital.arizona.com.br/Web/clientes/assets-geral/js/custom-back.js'>${closeScript}
  <script type="text/javascript" DEFER="DEFER">
  $('.showBanner').click(function(){
     $('.box-banner').show();
     $('.box-banner').html ("<iframe style='width:" + ${extractedWH[0]} + "px;height: " + ${extractedWH[1]} + "px;' src='" + banner + "'></iframe>");
      window.scrollTo(0, 0);
       
      $('#format').html('<span id="format">+${extractedWH[0]}x${extractedWH[1]}px</span>')
  });
  ${closeScript}
</body>
</html>
      `;
    myDiv.innerHTML = htmlCodeInicio+htmlCodeTitulo+result+htmlCodeFinal;
  }


  //Funcao para emkt

  function extractFolderDataEmail() {

    const htmlCodeInicio = `
<!doctype html>
<html>
<head>
<meta charset='UTF-8'><meta name='viewport' content='minimum-scale=1.0, maximum-scale=1.0, width=device-width, user-scalable=no'/>
<title>Arizona</title>
<link rel='stylesheet'type='text/css'href='https://digital.arizona.com.br/Web/clientes/assets-geral/css/bootstrap.css'>
<link rel='stylesheet'type='text/css'href='https://digital.arizona.com.br/Web/clientes/assets-geral/css/style.css'>
<style type="text/css">

  .showCase {
    background: #272727;
    top: 100px;
  }

  .content-banner {
    padding-top: 8px;
  }

  .content-banner .box-banner {
    top: 40px;
  }

  .AZ-close{
    top: 10px;
  }

  #format{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    color: #ffffff;
  }


  .grid {
    grid-template-columns: 25% 25% 25% 25%
  }

  @media (max-width: 990px) {
    .grid {
      grid-template-columns: 25% 25% 25% 25%
    }

    .dis-none {
      display: none !important;
    }
  }

  #prev {
    width: 0;
    height: 0;
    overflow: hidden;
  }

  @media (min-width: 990px) {
    .content-banner.not {
      margin: 0 auto;
      top: 20px;
      max-width: 1260px;
    }
  }

  .apresentacao {
    width: 200px;
    height: auto;
    padding: 10px 15px;
    display: block;
    margin-top: 30px;
    margin-bottom: 50px;
    border-radius: 15px;
    outline: 1px solid black;
    text-align: center;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  .apresentacao a {
    color: black;
    text-decoration: none;
  }

  .apresentacao:hover {
    background: #cacaca;
  }
</style>
</head>
<body>`;
    var htmlCodeTitulo = `
<div class='container-fluid' id='topHeader'>
  <div class='content mt-2 mb-2 header'>
    <div class='row p-2'>
      <div class='logo col-md-2 col-3' >
        <img src='https://digital.arizona.com.br/Web/clientes/assets-geral/img/logo-2020.png' alt=''>
      </div>
      <div class='titulo-desc col-md-10 col-9'>${clienteSelecionado} | ${codDoProjSelecionado} | ${nomeDoProjSelecionado}
      </div>
    </div>
  </div>
</div>
<div class='showCase' onclick='resetExpand()'>
  <div class='AZ-close'>X</div>
  <div class='content-banner'>
    <div class='box-banner'></div>
  </div>
</div>
<div class='content px-2'>
  <div class='grid py-2' id='menu-nav'>
    <div>Linha</div>
    <div>Peça</div>
    <div>Layout Base</div>
    <div>Observação</div>
  </div>
    `;
    const htmlCodeArquivos = "";
    closeScript = "</scr" + "ipt>";
    const htmlCodeFinal =` 
  <div id='prev'>
    <img src='https://digital.arizona.com.br/Web/clientes/assets-geral/fundo/fundo_vert.jpg'>
    <img src='https://digital.arizona.com.br/Web/clientes/assets-geral/fundo/fundo_quad.jpg'>
    <img src='https://digital.arizona.com.br/Web/clientes/assets-geral/fundo/fundo_quad-g.jpg'>
    <img src='https://digital.arizona.com.br/Web/clientes/assets-geral/fundo/fundo_hori.jpg'>
    <img src='https://digital.arizona.com.br/Web/clientes/assets-geral/fundo/fundo_hori-g.jpg'>
    <img src='https://digital.arizona.com.br/Web/clientes/assets-geral/fundo/fundo-branco.png'>
  </div>
  <!-- JS -->
  <script src='https://digital.arizona.com.br/Web/clientes/assets-geral/js/jquery.js'>${closeScript}
  <script src='https://digital.arizona.com.br/Web/clientes/assets-geral/js/custom-back.js'>${closeScript}
</body>
</html>
      `;

    const resultContainer = document.getElementById('resultContainer');
    const folderDataTextarea = document.getElementById('folderDataTextarea');
    //folderDataTextarea.value = '';
    let result = '';

    resultContainer.innerHTML = '';

    folderData.forEach(data => {
      var numeroContador = 0;
      const folderName = data.folderName;
      const manualUrl = getDropdownValueEmktUrl(folderName);

      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.textContent = `Folder: ${folderName}, Dropdown Value: ${manualUrl}`;

      resultContainer.appendChild(resultItem);

      const extractedName = extractName(folderName);
      
      const extractedOnlyName = extractOnlyName(folderName);

      result += `
  <div class="grid py-2">
    <div>Peça </div>
    <div>
      <a href="${manualUrl}" class="btn btn-basic pull-center" target="_blank">Veja a peça</a>
    </div>
    <div class="dis-none">
      <a target="_blank" href="${extractedOnlyName}.jpg" class="btn btn-basic">Veja layout</a>
    </div>
    <div>
      EMM
    </div>
  </div>
`;
    });
    myDiv.innerHTML = htmlCodeInicio+htmlCodeTitulo+result+htmlCodeFinal;
  }

  function getDropdownValue(folderName) {
    const dropdownSelects = document.getElementsByClassName('dropdown-select');

    for (let i = 0; i < dropdownSelects.length; i++) {
      const dropdown = dropdownSelects[i];

      if (dropdown.parentElement.parentElement.firstChild.textContent === folderName) {
        return dropdown.value;
      }
    }

    return null;
  }

  function getDropdownValueEmktUrl(folderName) {
    const urlInputs = document.getElementsByClassName('linkurl-input');

    for (let i = 0; i < urlInputs.length; i++) {
      const inputs = urlInputs[i];

      if (inputs.parentElement.parentElement.firstChild.textContent === folderName) {
        return inputs.value;
      }
    }

    return null;
  }

  function extractName(folderName) {
    return folderName.split(/[_-]/,4);
  }

  function extractWidthAndHeight(folderName) {
    return folderName.match(/\d+/g);
  }

  function extractOnlyName(folderName) {
    return folderName.slice(0,-4);
  }

  function save_func(){
    var data = document.getElementById("folderDataTextarea").value;
    var file = new Blob([data],{type:"html"});
    var anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(file);
    anchor.download = "index.html";
    anchor.click();
   }