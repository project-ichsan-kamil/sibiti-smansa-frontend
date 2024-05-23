import React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';

const ModalPopup = ({ title, onOk, onCancel, content }) => {
    const showConfirm = () => {
        Modal.confirm({
            title: title || 'Do you want to delete these items?',
            icon: <ExclamationCircleFilled />,
            content: content || 'Some descriptions',
            onOk: onOk || (() => {}),
            onCancel: onCancel || (() => {}),
        });
    };

    const success = () =>{
      Modal.success({
        title: title,
        content: content,
        onOk : onOk
      });
    }

    const error = () => {
      Modal.error({
        title: title,
        content: content,
      });
    };

    return { showConfirm, success, error };
};

export default ModalPopup;
