/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import cn from 'classnames';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoStatus,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export enum FilterTypes {
  All,
  Active,
  Completed,
}

function filteringTodos(array: Todo[], filterType: FilterTypes) {
  let arrayCopy = [...array];

  switch (filterType) {
    case FilterTypes.Active:
      arrayCopy = arrayCopy.filter(item => !item.completed);
      break;
    case FilterTypes.Completed:
      arrayCopy = arrayCopy.filter(item => item.completed);
      break;
    case FilterTypes.All:
      return array;
  }

  return arrayCopy;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.All);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => alert('Error while setting todos!'));
  }, []);

  const deleteSelectedTodo = (targetId: number) => {
    deleteTodo(targetId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== targetId));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const pushingNewTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    if (newTodoTitle) {
      addTodo(pushingNewTodo)
        .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
        .catch(() => alert('Error while adding a todo!'))
        .finally(() => setNewTodoTitle(''));
    }

    return;
  };

  const isTodosEmpty = todos.length === 0;

  const isAllTodosCompleted = todos.every(todo => todo.completed);

  const filteredTodos = filteringTodos(todos, filterType);

  const handleTodoStatus = (todo: Todo) => {
    const todoWithNewStatus: Todo = {
      id: todo.id,
      userId: USER_ID,
      title: todo.title,
      completed: !todo.completed,
    };

    updateTodoStatus(todoWithNewStatus)
      .then(patchedTodo =>
        setTodos(currentTodos => {
          const updatingTodos = [...currentTodos];
          const indexOfTodo = todos.findIndex(
            todoFromArray => todoFromArray.id === patchedTodo.id,
          );

          updatingTodos.splice(indexOfTodo, 1, todoWithNewStatus);

          return updatingTodos;
        }),
      )
      .catch(() => alert('Error while updating todo!'));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllTodosCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={event => handleSubmit(event)}>
            <input
              value={newTodoTitle}
              onChange={event =>
                setNewTodoTitle(event.target.value.trimStart())
              }
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          onDeleteTodo={deleteSelectedTodo}
          onChangeTodoStatus={handleTodoStatus}
        />

        {!isTodosEmpty && (
          <Footer
            todos={todos}
            onSettingFilter={setFilterType}
            filterType={filterType}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {/* <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div> */}
    </div>
  );
};
