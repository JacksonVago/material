import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import ReactDOM from "react-dom";

const confirmRoot = document.createElement("div");
const body = document.querySelector("body");
body?.appendChild(confirmRoot);

interface Props {
    title?: string;
    text: string;
    options?: {
      falseButtonText?: string;
      trueButtonText?: string;
    };
  }
  
  interface ConfirmDialogProps {
    title?: string;
    text: string;
    options?: {
      falseButtonText?: string;
      trueButtonText?: string;
    };
    giveAnswer: (answer: boolean) => void;
  }
  
  function ConfirmDialog({
    title,
    text,
    giveAnswer,
    options
  }: ConfirmDialogProps) {
    return (
      <Dialog
        open
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => giveAnswer(false)} color="primary">
            {options?.falseButtonText ? options?.falseButtonText : "Disagree"}
          </Button>
          <Button onClick={() => giveAnswer(true)} color="primary" autoFocus>
            {options?.trueButtonText ? options?.trueButtonText : "Agree"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  export const customConfirm = ({
    text,
    title,
    options
  }: Props): Promise<boolean> =>
    new Promise((res) => {
      const giveAnswer = (answer: boolean) => {
        ReactDOM.unmountComponentAtNode(confirmRoot);
        res(answer);
      };
  
      ReactDOM.render(
        <ConfirmDialog
          title={title}
          text={text}
          giveAnswer={giveAnswer}
          options={options}
        />,
        confirmRoot
      );
    });
  