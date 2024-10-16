import React, { Dispatch } from 'react';
import { Todo } from '../types/Todo';
import { FilterTypes } from '../App';
import cn from 'classnames';

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

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${amountOfActiveTodos} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          onClick={() => onSettingFilter(FilterTypes.All)}
          href="#/"
          className={cn('filter__link', {
            selected: filterType === FilterTypes.All,
          })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          onClick={() => onSettingFilter(FilterTypes.Active)}
          href="#/active"
          className={cn('filter__link', {
            selected: filterType === FilterTypes.Active,
          })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          onClick={() => onSettingFilter(FilterTypes.Completed)}
          href="#/completed"
          className={cn('filter__link', {
            selected: filterType === FilterTypes.Completed,
          })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
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
