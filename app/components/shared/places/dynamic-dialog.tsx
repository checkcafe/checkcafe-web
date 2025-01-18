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
  dialogTitle: string;
  dialogDescription: string;
  childrenFooter?: React.ReactNode;
  childrenTrigger?: React.ReactNode;
}

const DynamicDialog: React.FC<DynamicDialogProps> = ({
  open,
  setOpen,
  dialogTitle,
  dialogDescription,
  childrenFooter,
  childrenTrigger,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{childrenTrigger}</AlertDialogTrigger>
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
