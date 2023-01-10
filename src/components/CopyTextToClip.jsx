import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import {IconButton, useClipboard } from "@chakra-ui/react";

/**
 * Mark icon as copied and rolback to initial state after 3 seconds
 */
const COPY_TO_CLIPBOARD_TIMEOUT = 3000;

export const CopyTextToClip = ({ text = "", size = "xs", variant="ghost" }) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard(
    "",
    COPY_TO_CLIPBOARD_TIMEOUT
  );

  const markCopiedAndResetIcon = () => {
    setValue(text);
    onCopy();
  };

  return (
    <>
      {hasCopied ? (
        <IconButton
          variant={variant}
          colorScheme="blue"
          aria-label="Copy"
          size={size}
          icon={<CheckIcon />}
        />
      ) : (
        <IconButton
          className="hover:cursor-pointer"
          variant={variant}
          colorScheme="blue"
          aria-label="Copy"
          size={size}
          onClick={() => markCopiedAndResetIcon()}
          icon={<CopyIcon />}
        />
      )}
    </>
  );
};
