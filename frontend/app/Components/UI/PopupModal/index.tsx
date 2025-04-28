import React from "react";
import {
  DialogTitle,
  DialogContent,
  Slide,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { ModalContainer } from "./styled";
import { TransitionProps } from "@mui/material/transitions";
import { DialogProps } from "@mui/material/Dialog";

type PopupModalProps = DialogProps & {
  handleClose: () => void;
  showHeader?: boolean;
  headerText?: string | React.JSX.Element;
  hasFooter?: boolean;
  confirmText?: string;
  onConfirm?: () => void;
  showClose?: boolean;
  hideCancel?: boolean;
  cancelText?: string;
  transparent?: boolean;
  extraFooterComponent?: React.JSX.Element;
  disableConfirm?: boolean;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PopupModal = ({
  handleClose,
  showHeader = true,
  headerText = "Modal",
  children,
  hasFooter,
  confirmText,
  showClose,
  hideCancel,
  cancelText,
  onConfirm,
  transparent,
  disableConfirm = false,
  extraFooterComponent,
  ...rest
}: PopupModalProps) => {
  return (
    <ModalContainer
      {...rest}
      customProps={{ transparent }}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => handleClose()}
      aria-describedby="alert-dialog-slide-description"
    >
      {showHeader && (
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <>
            <Typography sx={{ fontSize: "30px", fontWeight: 600 }}>
              {headerText}
            </Typography>
            {showClose && (
              <IconButton onClick={() => handleClose()}>x</IconButton>
            )}
          </>
        </DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
      {hasFooter && (
        <DialogActions>
          {!hideCancel && (
            <Button
              variant="outlined"
              sx={{ px: 3, py: 1.5, borderRadius: "20px" }}
              onClick={() => handleClose()}
            >
              {cancelText ?? "Cancel"}
            </Button>
          )}
          {extraFooterComponent && extraFooterComponent}
          <Button
            variant="contained"
            sx={{ px: 3, py: 1.5, borderRadius: "20px" }}
            color="secondary"
            onClick={() => onConfirm && onConfirm()}
            autoFocus
            disabled={disableConfirm}
          >
            {confirmText ?? "Done"}
          </Button>
        </DialogActions>
      )}
    </ModalContainer>
  );
};

export default PopupModal;
