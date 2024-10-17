import React, { Dispatch } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { FilterTypes } from '../App';

interface Props {
  todos: Todo[];
  onSettingFilter: Dispatch<React.SetStateAction<FilterTypes>>;
  filterType: FilterTypes;
}

export const Footer: React.FC<Props> = ({
  todos,
  onSettingFilter,
  filterType,
}) => {
  const amountOfActiveTodos = todos.filter(todo => !todo.completed).length;
  const isSomeTodoIsCompleted = todos.some(todo => todo.completed === true);

  const handleFiltering = (type: FilterTypes) => {
    switch (type) {
      case 'All':
        return onSettingFilter(FilterTypes.All);
      case 'Active':
        return onSettingFilter(FilterTypes.Active);
      case 'Completed':
        return onSettingFilter(FilterTypes.Completed);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {amountOfActiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterTypes).map(type => (
          <a
            key={type}
            onClick={() => handleFiltering(type)}
            href="#/"
            className={cn('filter__link', {
              selected: filterType === type,
            })}
            data-cy={`FilterLink${type}`}
          >
            {type}
          </a>
        ))}
      </nav>

      <button
        type="button"
        disabled={!isSomeTodoIsCompleted}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
