import type { Locator, Page } from '@playwright/test';

/**
 * Page Object for the TodoMVC demo app.
 * Locators and user actions live here; assertions stay in the spec file.
 */
export class TodoMvcPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly clearCompletedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    // The footer filter links are also <li> elements, so only count list items
    // that contain a checkbox. That leaves exactly the todo rows.
    this.todoItems = page.getByRole('listitem').filter({ has: page.getByRole('checkbox') });
    this.todoCount = page.getByText(/\d+ items? left/);
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
  }

  async goto() {
    await this.page.goto('/todomvc');
  }

  todoItem(text: string): Locator {
    return this.todoItems.filter({ hasText: text });
  }

  async addTodo(text: string) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  async addTodos(texts: string[]) {
    for (const text of texts) {
      await this.addTodo(text);
    }
  }

  async complete(text: string) {
    await this.todoItem(text).getByRole('checkbox').check();
  }

  async filterBy(filter: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name: filter, exact: true }).click();
  }

  async edit(oldText: string, newText: string) {
    const item = this.todoItem(oldText);
    await item.getByText(oldText).dblclick();
    const editBox = item.getByRole('textbox');
    await editBox.fill(newText);
    await editBox.press('Enter');
  }

  async remove(text: string) {
    const item = this.todoItem(text);
    await item.hover(); // the delete button only appears on hover
    await item.getByRole('button').click();
  }

  async clearCompleted() {
    await this.clearCompletedButton.click();
  }
}