import React from "react";
import FullScreenLayout from "../layout/FullScreenLayout";
import { Spinner } from "@nextui-org/react";

function FullScreenSpinner() {
  return (
    <FullScreenLayout>
      <Spinner />
    </FullScreenLayout>
  );
}

export default FullScreenSpinner;
