/*
  this component render a confirmation(yes/no) model
  properties:
      message: message of the dialog
      onAcceptClick: accept callback
      onRejectClick: reject callback
  this component is used in PostModal.js
*/

import React from "react"
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap"

const ConfirmModal = props => {
  const onAcceptClickHandler = () => props.onAcceptClick()
  const onRejectClickHandler = () => props.onRejectClick()

  return (
    <Modal
      isOpen
      toggle={onRejectClickHandler}
      className="text-right modal-sm"
      backdrop
      centered
    >
      <ModalBody>{props.message}</ModalBody>
      <ModalFooter className="text-right">
        <Button color="danger" onClick={onAcceptClickHandler} size="sm">
          بله
        </Button>{" "}
        <Button color="secondary" onClick={onRejectClickHandler} size="sm">
          خیر
        </Button>
      </ModalFooter>
    </Modal>
  )
}
export default ConfirmModal
