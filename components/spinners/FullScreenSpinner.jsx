import React from "react";
import FullScreenLayout from "../layout/FullScreenLayout";
import { Spinner } from "@nextui-org/react";

function FullScreenSpinner() {
  return (
    <FullScreenLayout className="bg-background">
      <Spinner />
    </FullScreenLayout>
  );
}

export default FullScreenSpinner;
