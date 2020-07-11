
const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

const modalAdd =  document.querySelector('.modal__add'),
        addAd =  document.querySelector('.add__ad'),
        modalBtnSubmit =  document.querySelector('.modal__btn-submit'),
        modalSubmit = document.querySelector('.modal__submit'),
        catalog = document.querySelector('.catalog'),
        modalItem = document.querySelector(".modal__item"),
        modalBtnWarning = document.querySelector('.modal__btn-warning'),
        modalFileInput = document.querySelector('.modal__file-input'),
        modalFileBtn = document.querySelector('.modal__file-btn'),
        modalImageAdd = document.querySelector('.modal__image-add'),
        modalImageItem = document.querySelector('.modal__image-item'),
        modalHeaderItem = document.querySelector('.modal__header-item'),
        modalStatusItem = document.querySelector('.modal__status-item'),
        modalDescriptionItem = document.querySelector('.modal__description-item'),
        modalCostItem = document.querySelector('.modal__cost-item'),
        searchInput = document.querySelector('.search__input'),
        menuContainer =  document.querySelector('.menu__container');

        


const infoPhoto = {};

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements].filter((elem)=>{
    return elem.tagName !== 'BUTTON' && elem.type !== 'submit'
})



const saveDB = ()=>{
    localStorage.setItem('awito', JSON.stringify(dataBase))
}

const checkForm=()=>{
  const validForm = elementsModalSubmit.every(elem=>elem.value);
    console.log(validForm);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none': '';
}

modalSubmit.addEventListener('input',()=>{
    checkForm()
  ;
})

modalSubmit.addEventListener('submit', (e)=>{
    e.preventDefault();
    let obj={};
    let counter = dataBase.length;
    for(const elem of elementsModalSubmit){
        obj[elem.name]=elem.value;
    }
    obj.id = counter++
    obj.image = infoPhoto.base64;
    dataBase.push(obj);
    modalSubmit.reset();
    saveDB();
    renderCard();
})


addAd.addEventListener('click',()=>{
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModalEscape)

})
 const closeModal = e=>{
        const target = e.target;
        if(target.closest('.modal__close')|| target === modalAdd || target===modalItem){
            modalAdd.classList.add('hide');
            modalSubmit.reset();
            modalItem.classList.add('hide');
            document.removeEventListener('keydown', closeModalEscape)
            modalImageAdd.src = srcModalImage;
            modalFileBtn.textContent = textFileBtn
        }
    
    }
    const closeModalEscape =  e=>{
        if(e.code==='Escape'){
            modalItem.classList.add('hide');
            modalAdd.classList.add('hide');
        }

    }


const renderCard =(DB=dataBase)=>{
    catalog.textContent="";
    DB.forEach((item, i)=>{
        catalog.insertAdjacentHTML('beforeend',`
        <li class="card" data-id="${item.id}">
					<img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
					<div class="card__description">
						<h3 class="card__header">${item.nameItem}</h3>
						<div class="card__price">${item.costItem} ₽</div>
					</div>
				</li> 
        
        
        `)
    })

}

searchInput.addEventListener('input', e=>{
  const valueSearch = searchInput.value.trim().toLowerCase();

if(valueSearch.length>2){
    const result =  dataBase.filter(item=>item.nameItem.toLowerCase().includes(valueSearch)
    ||item.descriptionItem.toLowerCase().includes(valueSearch)
          )
    renderCard(result)
}
    if(!valueSearch.length){
    renderCard()
    }


})

modalFileInput.addEventListener('change', (e)=>{
    const target = e.target;
    const reader = new FileReader();
    const file = target.files[0]  
    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;
    reader.readAsBinaryString(file);
    reader.addEventListener('load', (e)=>{
        if(infoPhoto.size < 200000){
            modalFileBtn.textContent = infoPhoto.filename;
        infoPhoto.base64=btoa(e.target.result)
        modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
        }
        else{
            modalFileBtn.textContent = 'Размер файла не должен превышать 200 кб';
            modalFileInput.value = '';
            checkForm();
        }
        
    
    });

});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

catalog.addEventListener('click', e=>{
    const target = e.target;
    const card = target.closest('.card')
    if(card){
    let id = card.dataset.id;
    
     let item =  dataBase.find(item=>item.id===+id);
     
        modalImageItem.src = `data:image/jpeg;base64,${item.image}`
        modalHeaderItem.textContent = item.nameItem
        modalStatusItem.textContent = item.status==='new'? 'Новый' : "Б/У"
        modalDescriptionItem.textContent = item.descriptionItem;
        modalCostItem.textContent = item.costItem;

        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModalEscape) 
        
    };

})

renderCard()

menuContainer.addEventListener('click', e=>{
    const target = e.target;
    if(target.tagName==='A'){
        const result = dataBase.filter(item=>item.category===target.dataset.category);
        renderCard(result);
    }


});


{/* <li class="card">
					<img class="card__image" src="img/temp.jpg" alt="test">
					<div class="card__description">
						<h3 class="card__header">Тестовая карточка</h3>
						<div class="card__price">4000 ₽</div>
					</div>
				</li> */}