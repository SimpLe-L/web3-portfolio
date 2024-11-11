"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Loader from "../crowdfunding/components/Loader";
const Staking = () => {
  const [loading, setLoading] = useState(false)

  return (
    <div>
      {
        loading && (
          <Loader></Loader>
        )
      }
      <Button
        onClick={() => {
          setLoading(true)
        }}
      >
        Show Toast
      </Button>
    </div>
  )
}

export default Staking;