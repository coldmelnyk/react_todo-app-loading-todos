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
import { ErrorNotification } from './components/ErrorNotification';

export enum FilterTypes {
  All,
  Active,
  Completed,
}

export enum ErrorMessage {
  none = '',
  load = 'Unable to load todos',
  emptyTitle = 'Title should not be empty',
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  update = 'Unable to update a todo',
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.none,
  );

  useEffect(() => {
    setErrorMessage(ErrorMessage.none);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.load))
      .finally(() => setIsLoading(false));
  }, []);

  const deleteSelectedTodo = (targetId: number) => {
    setErrorMessage(ErrorMessage.none);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== targetId));

    deleteTodo(targetId)
      .catch(() => {
        setTodos(todos);
        setErrorMessage(ErrorMessage.delete);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage(ErrorMessage.none);

    const pushingNewTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    if (newTodoTitle) {
      return addTodo(pushingNewTodo)
        .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
        .catch(() => setErrorMessage(ErrorMessage.add))
        .finally(() => {
          setIsLoading(false);
          setNewTodoTitle('');
        });
    }

    return setErrorMessage(ErrorMessage.emptyTitle);
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
      .catch(() => setErrorMessage(ErrorMessage.update))
      .finally(() => setIsLoading(false));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  if (errorMessage !== ErrorMessage.none) {
    setTimeout(() => {
      setErrorMessage(ErrorMessage.none);
    }, 3000);
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

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
