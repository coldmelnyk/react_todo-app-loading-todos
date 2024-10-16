import React from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../App';

interface Props {
  errorMessage: ErrorMessage;
}

export const ErrorNotification: React.FC<Props> = ({ errorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage === ErrorMessage.none,
      })}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
