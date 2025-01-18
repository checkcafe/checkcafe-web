import React, { useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

interface DynamicDialogProps {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
  buttonTriggerTitle: string;
  dialogTitle: string;
  dialogDescription: string;
  childrenFooter?: React.ReactNode;
}

const DynamicDialog: React.FC<DynamicDialogProps> = ({
  open,
  setOpen,
  buttonTriggerTitle,
  dialogTitle,
  dialogDescription,
  childrenFooter,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{buttonTriggerTitle}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {childrenFooter}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DynamicDialog;
