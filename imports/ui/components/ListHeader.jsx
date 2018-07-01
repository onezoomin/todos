/* global confirm */
/* eslint-disable no-alert, no-restricted-globals */

import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import MobileMenu from './MobileMenu.jsx';
import { displayError } from '../helpers/errors.js';

import {
  updateName,
  makePublic,
  makePrivate,
  remove,
} from '../../api/lists/methods.js';
import { insert } from '../../api/todos/methods.js';

import { Icon, Popover, Button, AutoComplete } from 'antd';
const Option = AutoComplete.Option;

class Complete extends React.Component {
  state = {
    allOptions: [],
    filteredOptions: [],
  };
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, {
      allOptions: this.props.allOptions,
      filteredOptions: this.props.allOptions,
    });
  }
  handleSearch = (value) => {
    let filteredOptions;
    filteredOptions = ['gmail.com', '163.com', 'qq.com'].map(
      (domain) => `${value}@${domain}`
    );

    this.setState({ filteredOptions });
  };

  render() {
    const { result } = this.state;
    const Option = AutoComplete.Option;
    const children = result.map((email) => {
      return <Option key={email}>{email}</Option>;
    });
    return (
      <AutoComplete
        style={{ width: 200 }}
        onSearch={this.handleSearch}
        placeholder="input here"
      >
        {children}
      </AutoComplete>
    );
  }
}

export default class ListHeader extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editing: false });
    this.onListFormSubmit = this.onListFormSubmit.bind(this);
    this.onListInputKeyUp = this.onListInputKeyUp.bind(this);
    this.onListInputBlur = this.onListInputBlur.bind(this);
    this.onListDropdownAction = this.onListDropdownAction.bind(this);
    this.editList = this.editList.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.saveList = this.saveList.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.toggleListPrivacy = this.toggleListPrivacy.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.focusTodoInput = this.focusTodoInput.bind(this);
  }

  onListFormSubmit(event) {
    event.preventDefault();
    this.saveList();
  }

  onListInputKeyUp(event) {
    if (event.keyCode === 27) {
      this.cancelEdit();
    }
  }

  onListInputBlur() {
    if (this.state.editing) {
      this.saveList();
    }
  }

  onListDropdownAction(event) {
    if (event.target.value === 'delete') {
      this.deleteList();
    } else {
      this.toggleListPrivacy();
    }
  }

  editList() {
    this.setState({ editing: true }, () => {
      this.listNameInput.focus();
    });
  }

  cancelEdit() {
    this.setState({ editing: false });
  }

  saveList() {
    this.setState({ editing: false });
    updateName.call(
      {
        listId: this.props.list._id,
        newName: this.listNameInput.value,
      },
      displayError
    );
  }

  deleteList() {
    const { list } = this.props;
    const message = `${i18n.__('components.listHeader.deleteConfirm')} ${
      list.name
    }?`;

    if (confirm(message)) {
      remove.call({ listId: list._id }, displayError);
      this.redirectTo('/');
    }
  }

  toggleListPrivacy() {
    const { list } = this.props;
    if (list.userId) {
      makePublic.call({ listId: list._id }, displayError);
    } else {
      makePrivate.call({ listId: list._id }, displayError);
    }
  }

  createTodo(event) {
    event.preventDefault();
    const input = this.newTodoInput;
    if (input.value.trim()) {
      insert.call(
        {
          listId: this.props.list._id,
          text: input.value,
        },
        displayError
      );
      input.value = '';
    }
  }

  focusTodoInput() {
    this.newTodoInput.focus();
  }

  renderDefaultHeader() {
    const { list, todos } = this.props;
    const Option = AutoComplete.Option;
    const children = todos.map((eachTodo) => {
      return (
        <Option key={eachTodo.text} value={eachTodo._id}>
          {eachTodo.text}
        </Option>
      );
    });
    return (
      <div>
        <MobileMenu menuOpen={this.props.menuOpen} />
        <h1 className="title-page" onClick={this.editList}>
          <span className="title-wrapper">{list.name}</span>
          <span className="count-list">{list.incompleteCount}</span>
        </h1>
        <div className="nav-group right">
          <div className="nav-item options-mobile">
            <select
              className="list-edit"
              defaultValue="default"
              onChange={this.onListDropdownAction}
            >
              <option disabled value="default">
                {i18n.__('components.listHeader.selectAction')}
              </option>
              {list.userId ? (
                <option value="public">
                  {i18n.__('components.listHeader.makePublic')}
                </option>
              ) : (
                <option value="private">
                  {i18n.__('components.listHeader.makePrivate')}
                </option>
              )}
              <option value="delete">
                {i18n.__('components.listHeader.delete')}
              </option>
            </select>
            <span className="icon-cog" />
          </div>
          <div className="options-web">
            <Popover
              placement="left"
              content={
                <AutoComplete style={{ width: 200 }} placeholder="find a task">
                  {children}
                </AutoComplete>
              }
            >
              <Icon className="filter-popover-icon" type="filter" />
            </Popover>
            <a className="nav-item" onClick={this.toggleListPrivacy}>
              {list.userId ? (
                <span
                  className="icon-lock"
                  title={i18n.__('components.listHeader.makeListPublic')}
                />
              ) : (
                <span
                  className="icon-unlock"
                  title={i18n.__('components.listHeader.makeListPrivate')}
                />
              )}
            </a>
            <a className="nav-item trash" onClick={this.deleteList}>
              <span
                className="icon-trash"
                title={i18n.__('components.listHeader.deleteList')}
              />
            </a>
          </div>
        </div>
      </div>
    );
  }

  renderEditingHeader() {
    const { list } = this.props;
    return (
      <form className="list-edit-form" onSubmit={this.onListFormSubmit}>
        <input
          type="text"
          name="name"
          autoComplete="off"
          ref={(c) => {
            this.listNameInput = c;
          }}
          defaultValue={list.name}
          onKeyUp={this.onListInputKeyUp}
          onBlur={this.onListInputBlur}
        />
        <div className="nav-group right">
          <a
            className="nav-item"
            onMouseDown={this.cancelEdit}
            onClick={this.cancelEdit}
          >
            <span
              className="icon-close"
              title={i18n.__('components.listHeader.cancel')}
            />
          </a>
        </div>
      </form>
    );
  }

  render() {
    const { editing } = this.state;
    return (
      this.renderRedirect() || (
        <nav className="list-header">
          {editing ? this.renderEditingHeader() : this.renderDefaultHeader()}
          <form className="todo-new input-symbol" onSubmit={this.createTodo}>
            <input
              type="text"
              ref={(c) => {
                this.newTodoInput = c;
              }}
              placeholder={i18n.__('components.listHeader.typeToAdd')}
            />
            <span className="icon-add" onClick={this.focusTodoInput} />
          </form>
        </nav>
      )
    );
  }
}

ListHeader.propTypes = {
  list: PropTypes.object,
  menuOpen: PropTypes.object.isRequired,
};
