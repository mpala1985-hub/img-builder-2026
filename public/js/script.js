document.addEventListener('DOMContentLoaded', () => {

  // --- ELEMENTI DOM ---
  const imageInput = document.getElementById('imageInput');
  const increaseBtn = document.getElementById('increase');
  const decreaseBtn = document.getElementById('decrease');
  const downloadBtn = document.getElementById('download');
  const verticalSlider = document.getElementById('verticalSlider');
  const horizontalSlider = document.getElementById('horizontalSlider');
  const arrowUp = document.getElementById('arrowUp');
  const arrowDown = document.getElementById('arrowDown');
  const arrowLeft = document.getElementById('arrowLeft');
  const arrowRight = document.getElementById('arrowRight');
  const germanMode = document.getElementById('germanMode');
  const germanOverlay = document.getElementById('germanOverlay');
  const germanFlagCreate = document.getElementById('germanFlagCreate');
  const germanTopMarginDiv = document.getElementById('germanTopMargin');
  const img = document.getElementById('uploadedImage');
  const canvasWrapper = document.getElementById('canvasWrapper');

  // --- ELEMENTI COPERTURA LIVE ---
const topCoverDiv = document.createElement('div');
const bottomCoverDiv = document.createElement('div');

topCoverDiv.style.position = 'absolute';
topCoverDiv.style.left = '0';
topCoverDiv.style.top = '0';
topCoverDiv.style.width = '100%';
topCoverDiv.style.backgroundColor = '#FFFFFF';
topCoverDiv.style.display = 'none';
topCoverDiv.style.zIndex = '5';

bottomCoverDiv.style.position = 'absolute';
bottomCoverDiv.style.left = '0';
bottomCoverDiv.style.bottom = '0';
bottomCoverDiv.style.width = '100%';
bottomCoverDiv.style.backgroundColor = '#FFFFFF';
bottomCoverDiv.style.display = 'none';
bottomCoverDiv.style.zIndex = '5';

canvasWrapper.appendChild(topCoverDiv);
canvasWrapper.appendChild(bottomCoverDiv);

  const coverBtn = document.getElementById('coverMode');
  const productBtn = document.getElementById('productMode');

  // --- COSTANTI ---
  const widthIncrement = 30;
  const MIN_WIDTH = 500;
  const START_WIDTH = 800;

  const PRODUCT_WIDTH = 1129;
  const PRODUCT_HEIGHT = 1080;
  const COVER_WIDTH = 1000;
  const COVER_HEIGHT = 826;

  const topCoverToggle = document.getElementById('topCoverToggle');
const bottomCoverToggle = document.getElementById('bottomCoverToggle');

const topCoverPlus = document.getElementById('topCoverPlus');
const topCoverMinus = document.getElementById('topCoverMinus');
const bottomCoverPlus = document.getElementById('bottomCoverPlus');
const bottomCoverMinus = document.getElementById('bottomCoverMinus');

const topCoverValue = document.getElementById('topCoverValue');
const bottomCoverValue = document.getElementById('bottomCoverValue');

  // --- VARIABILI ---
  let naturalWidth = 0;
  let naturalHeight = 0;
  let currentWidth = 0;
  let aspectRatio = 0;
  let offsetX = 0;
  let offsetY = 0;
  let isGermanMode = false;
  let currentMode = 'cover'; // COVER di default
  let topCoverHeight = 0;
  let bottomCoverHeight = 0;
  let isTopCoverActive = false;
  let isBottomCoverActive = false;
  // --- VARIABILI PER SALVATAGGIO TEMPORANEO ---
let savedTopCoverHeight = 0;
let savedBottomCoverHeight = 0;

  // --- AGGIORNA PREVIEW ---
  function updatePreviewContainer(mode = currentMode) {

      currentMode = mode;

      let frameWidth = currentMode === 'cover' ? COVER_WIDTH : PRODUCT_WIDTH;
      let frameHeight = currentMode === 'cover' ? COVER_HEIGHT : PRODUCT_HEIGHT;

      const outerContainer = canvasWrapper.parentElement;

      // container esterno (bordo nero reale)
      outerContainer.style.width = frameWidth + 'px';
      outerContainer.style.height = frameHeight + 'px';
      outerContainer.style.border = '2px solid black';
      outerContainer.style.backgroundColor = 'transparent';
      outerContainer.style.display = 'block';
      outerContainer.style.margin = '0 auto';
      outerContainer.style.position = 'relative';
      outerContainer.style.overflow = 'hidden';

      // canvasWrapper interno (sfondo bianco reale)
      canvasWrapper.style.width = frameWidth + 'px';
      canvasWrapper.style.height = frameHeight + 'px';
      canvasWrapper.style.position = 'relative';
      canvasWrapper.style.overflow = 'hidden';
      canvasWrapper.style.display = 'block';
      canvasWrapper.style.backgroundColor = '#ffffff';

      img.style.position = 'absolute';

      applyOffset();

      // stato pulsanti
      if(currentMode === 'cover'){
          coverBtn.style.backgroundColor = '#0E6EFD';
          coverBtn.style.color = 'white';
          productBtn.style.backgroundColor = '#f0f0f0';
          productBtn.style.color = '#000';
      } else {
          productBtn.style.backgroundColor = '#0E6EFD';
          productBtn.style.color = 'white';
          coverBtn.style.backgroundColor = '#f0f0f0';
          coverBtn.style.color = '#000';
      }
  }

  // Inizializzazione COVER
  updatePreviewContainer('cover');

  // --- PULSANTI COVER / PRODOTTO ---
coverBtn.addEventListener('click', () => {

    currentMode = 'cover';

    offsetX = 0;
    offsetY = 0;

    if(naturalWidth){

        let frameWidth = COVER_WIDTH;
        let frameHeight = COVER_HEIGHT;

        let ratioFrame = frameWidth / frameHeight;
        let ratioImg = naturalWidth / naturalHeight;

        if (ratioImg > ratioFrame) {
            currentWidth = frameWidth;
        } else {
            currentWidth = frameHeight * ratioImg;
        }

        applySize(currentWidth);
    }

    updatePreviewContainer('cover');
});

productBtn.addEventListener('click', () => {

    currentMode = 'product';

    offsetX = 0;
    offsetY = 0;

    if(naturalWidth){

        let frameWidth = PRODUCT_WIDTH;
        let frameHeight = PRODUCT_HEIGHT;

        let ratioFrame = frameWidth / frameHeight;
        let ratioImg = naturalWidth / naturalHeight;

        if (ratioImg > ratioFrame) {
            currentWidth = frameWidth;
        } else {
            currentWidth = frameHeight * ratioImg;
        }

        applySize(currentWidth);
    }

    updatePreviewContainer('product');
});
  // --- TEDESCO MODE ---
germanMode.addEventListener('change', function () {
    isGermanMode = this.checked;

    if (isGermanMode) {
        germanOverlay.style.display = 'flex';
        germanFlagCreate.style.display = 'inline';
        germanTopMarginDiv.style.display = 'block';

        // FORZA z-index sopra le bande bianche
        germanTopMarginDiv.style.position = 'absolute';
        germanTopMarginDiv.style.top = '0';
        germanTopMarginDiv.style.left = '0';
        germanTopMarginDiv.style.width = '100%';
        germanTopMarginDiv.style.zIndex = '10';  // sempre sopra topCoverDiv/bottomCoverDiv

        setTimeout(() => {
            germanOverlay.style.display = 'none';
        }, 1200);
    } else {
        germanFlagCreate.style.display = 'none';
        germanTopMarginDiv.style.display = 'none';
    }

    updateSliderLimits();
    applyOffset();
});

  // --- UPLOAD IMMAGINE ---
  imageInput.addEventListener('change', function (event) {

      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = function (e) {

          img.src = e.target.result;

          img.onload = function () {

              naturalWidth = img.naturalWidth;
              naturalHeight = img.naturalHeight;
              aspectRatio = naturalWidth / naturalHeight;

                offsetX = 0;
                offsetY = 0;

                let frameWidth = currentMode === 'cover' ? COVER_WIDTH : PRODUCT_WIDTH;
                let frameHeight = currentMode === 'cover' ? COVER_HEIGHT : PRODUCT_HEIGHT;

                let ratioFrame = frameWidth / frameHeight;
                let ratioImg = naturalWidth / naturalHeight;

                // FIT automatico nel frame
                if (ratioImg > ratioFrame) {
                    // immagine più larga → limita su width
                    currentWidth = frameWidth;
                } else {
                    // immagine più alta → limita su height
                    currentWidth = frameHeight * ratioImg;
                }

                applySize(currentWidth);
                updatePreviewContainer(currentMode);
          };
      };

      reader.readAsDataURL(file);
  });

  // --- RESIZE ---
  function applySize(width) {
      img.style.width = width + 'px';
      img.style.height = 'auto';
      updateSliderLimits();
      applyOffset();
  }

  // --- SLIDER ---
  function updateSliderLimits() {
      if(verticalSlider){
          verticalSlider.disabled = false;
          verticalSlider.min = -300;
          verticalSlider.max = 300;
          verticalSlider.value = offsetY;
      }
      if(horizontalSlider){
          horizontalSlider.disabled = false;
          horizontalSlider.min = -300;
          horizontalSlider.max = 300;
          horizontalSlider.value = offsetX;
      }
  }

 function applyOffset(){

    const frameWidth = canvasWrapper.clientWidth;
    const frameHeight = canvasWrapper.clientHeight;

    const drawWidth = currentWidth;
    const drawHeight = currentWidth / aspectRatio;

    const x = (frameWidth - drawWidth) / 2 + offsetX;
    const y = (frameHeight - drawHeight) / 2 + offsetY;

    img.style.left = x + 'px';
    img.style.top = y + 'px';
}

function updateCoverPreview(){

    if(isTopCoverActive && topCoverHeight > 0){
        topCoverDiv.style.height = topCoverHeight + 'px';
        topCoverDiv.style.display = 'block';
    } else {
        topCoverDiv.style.display = 'none';
    }

    if(isBottomCoverActive && bottomCoverHeight > 0){
        bottomCoverDiv.style.height = bottomCoverHeight + 'px';
        bottomCoverDiv.style.display = 'block';
    } else {
        bottomCoverDiv.style.display = 'none';
    }
}

function drawCoverAreas(ctx, canvasWidth, canvasHeight){

    ctx.fillStyle = '#FFFFFF';

    if(isTopCoverActive && topCoverHeight > 0){
        ctx.fillRect(0, 0, canvasWidth, topCoverHeight);
    }

    if(isBottomCoverActive && bottomCoverHeight > 0){
        ctx.fillRect(0, canvasHeight - bottomCoverHeight, canvasWidth, bottomCoverHeight);
    }
}


function showCoverInfoOverlay(position){
    const existing = document.getElementById('coverInfoOverlay');
    if(existing) existing.remove(); // rimuove eventuale overlay precedente

    const overlay = document.createElement('div');
    overlay.id = 'coverInfoOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '99999';

    const box = document.createElement('div');
    box.style.background = 'white';
    box.style.padding = '20px 30px';
    box.style.borderRadius = '12px';
    box.style.maxWidth = '400px';
    box.style.textAlign = 'center';
    box.style.position = 'relative';
    box.style.fontSize = '16px';

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '15px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '20px';
    closeBtn.addEventListener('click', ()=>{
        overlay.remove();
    });

    const text = document.createElement('p');
    text.style.margin = '0';
    text.style.fontWeight = '500';
    if(position === 'top'){
        text.textContent = 'Banda superiore attivata: copre l’area superiore dell’immagine. Puoi regolare altezza con +/-. Se non vedi niente, è perchè devi premere + fino a che la banda bianca non copre la parte desiderata!';
    } else {
        text.textContent = 'Banda inferiore: copre l’area inferiore dell’immagine. Puoi regolare altezza con +/-. Se non vedi niente, è perchè devi premere + fino a che la banda bianca non copre la parte desiderata!';
    }

    box.appendChild(closeBtn);
    box.appendChild(text);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}



  verticalSlider?.addEventListener('input', ()=>{
      offsetY = parseFloat(verticalSlider.value);
      applyOffset();
  });

  horizontalSlider?.addEventListener('input', ()=>{
      offsetX = parseFloat(horizontalSlider.value);
      applyOffset();
  });

  // --- FRECCE ---
  const MOVE_STEP = 2;

  arrowUp.addEventListener('click', ()=>{
      offsetY -= MOVE_STEP;
      applyOffset();
      verticalSlider.value = offsetY;
  });

  arrowDown.addEventListener('click', ()=>{
      offsetY += MOVE_STEP;
      applyOffset();
      verticalSlider.value = offsetY;
  });

  arrowLeft.addEventListener('click', ()=>{
      offsetX -= MOVE_STEP;
      applyOffset();
      horizontalSlider.value = offsetX;
  });

  arrowRight.addEventListener('click', ()=>{
      offsetX += MOVE_STEP;
      applyOffset();
      horizontalSlider.value = offsetX;
  });



// -- -- GESTIONE BANDE SUPERIORI E INFERIORI

const COVER_STEP = 10;

topCoverPlus?.addEventListener('click', ()=>{
    if(!isTopCoverActive) return;
    topCoverHeight += COVER_STEP;
    savedTopCoverHeight = topCoverHeight;       // salva valore
    topCoverValue.textContent = topCoverHeight + ' px';
    updateCoverPreview();
});

topCoverMinus?.addEventListener('click', ()=>{
    if(!isTopCoverActive) return;
    topCoverHeight = Math.max(0, topCoverHeight - COVER_STEP);
    savedTopCoverHeight = topCoverHeight;       // salva valore
    topCoverValue.textContent = topCoverHeight + ' px';
    updateCoverPreview();
});

bottomCoverPlus?.addEventListener('click', ()=>{
    if(!isBottomCoverActive) return;
    bottomCoverHeight += COVER_STEP;
    savedBottomCoverHeight = bottomCoverHeight; // salva valore
    bottomCoverValue.textContent = bottomCoverHeight + ' px';
    updateCoverPreview();
});

bottomCoverMinus?.addEventListener('click', ()=>{
    if(!isBottomCoverActive) return;
    bottomCoverHeight = Math.max(0, bottomCoverHeight - COVER_STEP);
    savedBottomCoverHeight = bottomCoverHeight; // salva valore
    bottomCoverValue.textContent = bottomCoverHeight + ' px';
    updateCoverPreview();
});

topCoverToggle?.addEventListener('change', function(){
    isTopCoverActive = this.checked;
    if(isTopCoverActive){
        topCoverHeight = savedTopCoverHeight;   // ripristina valore salvato
        showCoverInfoOverlay('top');            // mostra popup SOLO se attivo
    } else {
        savedTopCoverHeight = topCoverHeight;   // salva valore corrente
        topCoverHeight = 0;
    }
    topCoverValue.textContent = topCoverHeight + ' px';
    updateCoverPreview();
});

bottomCoverToggle?.addEventListener('change', function(){
    isBottomCoverActive = this.checked;
    if(isBottomCoverActive){
        bottomCoverHeight = savedBottomCoverHeight; // ripristina valore salvato
        showCoverInfoOverlay('bottom');            // mostra popup SOLO se attivo
    } else {
        savedBottomCoverHeight = bottomCoverHeight; // salva valore corrente
        bottomCoverHeight = 0;
    }
    bottomCoverValue.textContent = bottomCoverHeight + ' px';
    updateCoverPreview();
});

  // --- ZOOM ---
  increaseBtn.addEventListener('click', ()=>{
      if(!img.src) return;
      currentWidth += widthIncrement;
      applySize(currentWidth);
  });

  decreaseBtn.addEventListener('click', ()=>{
      if(!img.src) return;
      currentWidth = Math.max(MIN_WIDTH, currentWidth - widthIncrement);
      applySize(currentWidth);
  });

  // --- DOWNLOAD ---
  downloadBtn.addEventListener('click', ()=>{

      if(!img.src) return;

      const canvas = document.createElement('canvas');

let canvasWidth = canvasWrapper.clientWidth;
let canvasHeight = canvasWrapper.clientHeight;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0,0,canvas.width,canvas.height);

      let drawWidth = currentWidth;
      let drawHeight = drawWidth / aspectRatio;

      let x = (canvasWidth - drawWidth)/2 + offsetX;
      let y = (canvasHeight - drawHeight)/2 + offsetY;

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      drawCoverAreas(ctx, canvasWidth, canvasHeight);

      const link = document.createElement('a');
      link.download = 'image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
  });

  // --- TUTORIAL OVERLAY ---
  const tutorialBtn = document.getElementById('tutorialBtn');
  const tutorialOverlay = document.getElementById('tutorialOverlay');
  const closeTutorial = document.getElementById('closeTutorial');

  if(tutorialBtn && tutorialOverlay && closeTutorial){

      tutorialBtn.addEventListener('click', () => {
          tutorialOverlay.style.display = 'flex';
      });

      closeTutorial.addEventListener('click', () => {
          tutorialOverlay.style.display = 'none';
      });

      tutorialOverlay.addEventListener('click', (e) => {
          if(e.target === tutorialOverlay){
              tutorialOverlay.style.display = 'none';
          }
      });
  }

});