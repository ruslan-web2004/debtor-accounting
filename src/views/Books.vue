<script setup>
  import {ref, computed, onMounted} from 'vue'
  import Tabs from '@/components/Tabs.vue'
  import Input from '@/components/Input.vue'
  import Button from '@/components/Button.vue'
  import BaseTable from '@/components/Table/BaseTable.vue'
  import TableRow from '@/components/Table/TableRow.vue'
  import TableColumn from '@/components/Table/TableColumn.vue'
  import useVuelidate from '@vuelidate/core'
  import {helpers, minLength, numeric} from '@vuelidate/validators'

  const tabs = [
    {name: 'ListBooks', label: 'Список книг'},
    {name: 'AddBook', label: 'Добавить книгу'}
  ]
  const selectedTab = ref('ListBooks')

  const changeTab = (tabName) => {
    selectedTab.value = tabName
  }
  const deleteBook = (bookIndex) => {
    books.value.splice(bookIndex, 1); // Удаляем книгу из массива
    localStorage.setItem('bookData', JSON.stringify(books.value)); // Обновляем данные в LocalStorage
  }

  const nameField = ref('')
  const authorField = ref('')
  const yearField = ref('')
  const books = ref('[]')
  const tableHeads = ['Название', 'Автор', 'Год издания', '', '']
  const tableSizeColumns = '1fr 1fr 2fr 150px 140px'

  onMounted(() => {
  let bookData = JSON.parse(localStorage.getItem('bookData')) || [];
  books.value = bookData;
});

  const rules = computed(() => ({
  nameField: {
    minLength: helpers.withMessage(`Минимальная длина: 3 символа`, minLength(3))
  },
  authorField: {
    minLength: helpers.withMessage(`Минимальная длина: 3 символа`, minLength(3))
  },
  yearField: {
    minLength: helpers.withMessage(`Минимальная длина: 3 символа`, minLength(3)),
    numeric: helpers.withMessage('Вы можете ввести только цифры', numeric)
  }
}))

const v = useVuelidate(rules, {nameField, authorField, yearField})

const submitForm = () => {
  if (
    nameField.value === '' ||
    authorField.value === '' ||
    yearField.value === ''
  ) {
    alert('Заполните все поля');
    return;
  }
  if (!v.value.$error) {
    let bookData = JSON.parse(localStorage.getItem('bookData')) || [];

  // Добавляем новую книгу в массив
  bookData.push({
    name: nameField.value,
    author: authorField.value,
    year: yearField.value
  });

  books.value.push({
    name: nameField.value,
    author: authorField.value,
    year: yearField.value
  });

  // Сохраняем обновленный массив данных в LocalStorage
  localStorage.setItem('bookData', JSON.stringify(bookData));

  // Очистка полей после добавления книги
  nameField.value = '';
  authorField.value = '';
  yearField.value = '';
} else {
    alert('Исправьте ошибки в форме перед сохранением');
  }
  }

</script>

<template>
  <h1 class="heading-1">Книги</h1>
  <Tabs
    :names="tabs"
    :selectedTab="selectedTab"
    @changeTab="changeTab">
    <div v-if="selectedTab === 'ListBooks'">
      <div v-if="books.length">
        <base-table
        :head="tableHeads"
        :columnTemplates="tableSizeColumns">
          <table-row
            v-for="(book, index) in books"
            :key="book.name"
            :columnTemplates="tableSizeColumns">
            <table-column :columnTitle="tableHeads[0]">
              {{book.name}}
            </table-column>
            <table-column :columnTitle="tableHeads[1]">
              {{book.author}}
            </table-column>
            <table-column :columnTitle="tableHeads[2]">
              {{book.year}}
            </table-column>
            <table-column>
              <Button @click="deleteBook(index)" label="Удалить" color="danger"></Button>
            </table-column>
          </table-row>
        </base-table>
      </div>
      <div v-else><H1 class="heading-1">Вы пока не добавили книг</H1></div>
    </div>
    <div v-if="selectedTab === 'AddBook'">
      <form @submit.prevent="submitForm">
        <Input
          label="Название книги"
          name="name"
          placeholder="Введите название книги"
          v-model:value="v.nameField.$model"
          :error="v.nameField.$errors"/>
          
        <Input
          label="Автор книги"
          name="author"
          placeholder="Введите автора книги"
          v-model:value="v.authorField.$model"
          :error="v.authorField.$errors"/>
          
        <Input
          label="Год издания"
          name="lucky"
          placeholder="Введите год издания книги"
          v-model:value="v.yearField.$model"
          :error="v.yearField.$errors"/>

        <Button label="Добавить" color="success"></Button>
  </form>
    </div>
  </Tabs>
</template>