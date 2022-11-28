import React, { Component } from 'react';
import styles from '../Styles/Container.module.css';
const StateContainer = props => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <p>{props.title}</p>
        </div>
        <div className={styles.value}>
          <p style={{ color: props.color }}>{props.value || '--'}</p>
        </div>
      </div>
    </>
  );
};
export default StateContainer;
