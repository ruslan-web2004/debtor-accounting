<script setup>
  import {ref, computed, onMounted} from 'vue'
  import Tabs from '@/components/Tabs.vue'
  import useVuelidate from '@vuelidate/core'
  import {helpers, minLength, numeric} from '@vuelidate/validators'
  import Input from '@/components/Input.vue'
  import Button from '@/components/Button.vue'
  import BaseTable from '@/components/Table/BaseTable.vue'
  import TableRow from '@/components/Table/TableRow.vue'
  import TableColumn from '@/components/Table/TableColumn.vue'

  const tabs = [
    {name: 'DabtorList', label: 'Список должников'},
    {name: 'AddDabtor', label: 'Добавить должника'},
  ]
  const selectedTab = ref('DabtorList')

  const changeTab = (tabName) => {
    selectedTab.value = tabName
  }
  const nameField = ref('')
  const surnameField = ref('')
  const patronymicField = ref('')
  const numberField = ref('')
  const bookField = ref('')
  const books = ref('[]')
  const dabtors = ref('[]')
  const showBookList = ref(false);
  const tableHeads = ['Имя', 'Фамилия', 'Отчество', 'Номер', 'Книга', '']
  const tableSizeColumns = '1fr 1fr 2fr 150px 140px 140px'

  const hideBookList = () => {
     showBookList.value = false;
   };

   onMounted(() => {
  let bookData = JSON.parse(localStorage.getItem('bookData')) || [];
  books.value = bookData;
  let dabtorData = JSON.parse(localStorage.getItem('dabtorData')) || [];
  dabtors.value = dabtorData;
});
  const filteredBooks = computed(() => {
    return books.value.filter(book => book.name.toLowerCase().includes(bookField.value.toLowerCase()));
  });
  const selectBook = (book) => {
    bookField.value = book.name;
  };

  const rules = computed(() => ({
  nameField: {
    minLength: helpers.withMessage('Минимальная длина: 3 символа', minLength(3))
  },
  surnameField: {
    minLength: helpers.withMessage('Минимальная длина: 3 символа', minLength(3))
  },
  patronymicField: {
    minLength: helpers.withMessage('Минимальная длина: 3 символа', minLength(3))
  },
  numberField: {
    minLength: helpers.withMessage('Номер телефона должен состоять из 11 символов', minLength(11)),
    numeric: helpers.withMessage('Вы можете ввести только цифры', numeric)
  }
}));

const v = useVuelidate(rules, {nameField, surnameField, patronymicField, numberField, bookField})

const submitForm = () => {
  v.value.$touch();

  // Проверка на пустые поля
  if (
    nameField.value === '' ||
    surnameField.value === '' ||
    patronymicField.value === '' ||
    numberField.value === '' ||
    bookField.value === ''
  ) {
    alert('Заполните все поля');
    return;
  }

  if (!v.value.$error) {
    const newDabtor = {
      name: nameField.value,
      surname: surnameField.value,
      patronymic: patronymicField.value,
      number: numberField.value,
      book: bookField.value
    };

    let dabtorData = JSON.parse(localStorage.getItem('dabtorData')) || [];
    dabtorData.push(newDabtor);
    dabtors.value.push(newDabtor);
    localStorage.setItem('dabtorData', JSON.stringify(dabtorData));

    // Очистка полей формы после сохранения
    nameField.value = '';
    surnameField.value = '';
    patronymicField.value = '';
    numberField.value = '';
    bookField.value = '';

    // Опционально: обновление списка должников на странице, если это необходимо
  } else {
    alert('Исправьте ошибки в форме перед сохранением');
  }
};

const deleteDabtor = (dabtorIndex) => {
    dabtors.value.splice(dabtorIndex, 1); // Удаляем книгу из массива
    localStorage.setItem('dabtorData', JSON.stringify(dabtors.value)); // Обновляем данные в LocalStorage
  }

</script>

<template>
  <h1 class="heading-1">Должники</h1>
  <Tabs
    :names="tabs"
    :selectedTab="selectedTab"
    @changeTab="changeTab">
    <div v-if="selectedTab === 'DabtorList'">
      <div v-if="dabtors.length">
        <base-table
        :head="tableHeads"
        :columnTemplates="tableSizeColumns">
        <table-row
          v-for="(dabtor, index) in dabtors"
          :key="dabtor.name"
          :columnTemplates="tableSizeColumns">
          <table-column :columnTitle="tableHeads[0]">
            {{dabtor.name}}
          </table-column>
          <table-column :columnTitle="tableHeads[1]">
            {{dabtor.surname}}
          </table-column>
          <table-column :columnTitle="tableHeads[2]">
            {{dabtor.patronymic}}
          </table-column>
          <table-column :columnTitle="tableHeads[3]">
            {{dabtor.number}}
          </table-column>
          <table-column :columnTitle="tableHeads[4]">
            {{dabtor.book}}
          </table-column>
          <table-column>
            <Button @click="deleteDabtor(index)" label="Удалить" color="danger"></Button>
          </table-column>
        </table-row>
      </base-table>
      </div>
      <div v-else><H1 class="heading-1">Вы пока не добавили должников</H1></div>
    </div>
    <div v-if="selectedTab === 'AddDabtor'">
      <form @submit.prevent="submitForm">
        <Input
          label="Имя должника"
          name="name"
          placeholder="Введите имя должника"
          v-model:value="v.nameField.$model"
          :error="v.nameField.$errors"/>
          
        <Input
          label="Введите фамилию должника"
          name="surname"
          placeholder="Введите фамилию должника"
          v-model:value="v.surnameField.$model"
          :error="v.surnameField.$errors"/>
          
        <Input
          label="Отчество должника"
          name="patronymic"
          placeholder="Введите отчество должника"
          v-model:value="v.patronymicField.$model"
          :error="v.patronymicField.$errors"/>
          
        <Input
          label="Номер телефона должника"
          name="number"
          placeholder="Введите номер телефона должника"
          v-model:value="v.numberField.$model"
          :error="v.numberField.$errors"/>

          <Input
            label="Название книги"
            name="book"
            placeholder="Введите название книги"
            v-model:value="bookField"
            @input="showBookList = true; filteredBooks"
            @blur="hideBookList"
          />
          <div class="book-list-wrapper" v-if="showBookList && filteredBooks.length > 0">
            <ul class="book-list">
              <li v-for="book in filteredBooks" @click="selectBook(book); hideBookList()">
                {{ book.name }}
              </li>
            </ul>
          </div>
          

        <Button label="Submit" color="primary"></Button>
      </form>
    </div>
  </Tabs>
</template>

<style lang="scss" scoped>
  $select-padding: 5px;
  $select-font-size: 16px;
  $select-border-color: #ccc;
  $select-hover-border-color: #999;
  $select-focus-border-color: #555;

  select {
    padding: $select-padding;
    font-size: $select-font-size;
    border: 1px solid $select-border-color;
    border-radius: 4px;
    background-color: #f9f9f9;
    color: #333;
    margin-bottom: 20px;

    &:hover {
      border-color: $select-hover-border-color;
    }

    &:focus {
      outline: none;
      border-color: $select-focus-border-color;
    }
  }
  .book-list {
  position: absolute;
  z-index: 1000;
  max-height: 200px;
  width: 300px;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  top: -30px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.book-list-wrapper {
  position: relative;
}

.book-list li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.book-list li:hover {
  background-color: #f2f2f2;
}
</style>