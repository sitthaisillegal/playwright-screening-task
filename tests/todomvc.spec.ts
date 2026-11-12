import { test, expect } from '@playwright/test';
import { TodoMvcPage } from '../pages/todomvc.page';

const TODOS = ['Buy milk', 'Walk the dog', 'Write tests'];

test.describe('TodoMVC', () => {
  let todoPage: TodoMvcPage;

  // Fresh page object and a clean app for every test
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMvcPage(page);
    await todoPage.goto();
  });

  test('adds 3 todos and lists them', async () => {
    await todoPage.addTodos(TODOS);
    await expect(todoPage.todoItems).toHaveCount(3);
    await expect(todoPage.todoItems).toHaveText(TODOS);
  });

  // Tests 2-6 all start from the same three todos
  test.describe('with three todos', () => {
    test.beforeEach(async () => {
      await todoPage.addTodos(TODOS);
    });

    test('completing a todo updates the counter', async () => {
      await todoPage.complete('Walk the dog');
      await expect(todoPage.todoCount).toHaveText('2 items left');
    });

    test('Active and Completed filters show the right items', async () => {
      await todoPage.complete('Walk the dog');

      await todoPage.filterBy('Active');
      await expect(todoPage.todoItems).toHaveText(['Buy milk', 'Write tests']);

      await todoPage.filterBy('Completed');
      await expect(todoPage.todoItems).toHaveText(['Walk the dog']);
    });

    test('edits a todo', async () => {
      await todoPage.edit('Buy milk', 'Buy oat milk');
      await expect(todoPage.todoItems).toHaveText(['Buy oat milk', 'Walk the dog', 'Write tests']);
    });

    test('deletes a todo', async () => {
      await todoPage.remove('Walk the dog');
      await expect(todoPage.todoItems).toHaveText(['Buy milk', 'Write tests']);
    });

    test('"Clear completed" removes only completed todos', async () => {
      await todoPage.complete('Buy milk');
      await todoPage.clearCompleted();
      await expect(todoPage.todoItems).toHaveText(['Walk the dog', 'Write tests']);
    });
  });
});

// Bonus: data-driven tests, one generated test per value in the array
const SAMPLE_TODOS = ['Buy milk', 'Read a book', 'Go for a run', 'Call a friend'];

test.describe('data-driven: adding a single todo', () => {
  for (const todo of SAMPLE_TODOS) {
    test(`adds the todo "${todo}"`, async ({ page }) => {
      const todoPage = new TodoMvcPage(page);
      await todoPage.goto();
      await todoPage.addTodo(todo);
      await expect(todoPage.todoItems).toHaveText([todo]);
      await expect(todoPage.todoCount).toHaveText('1 item left');
    });
  }
});