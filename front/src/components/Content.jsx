import React, { useState } from "react";
import { Main } from "./Main";
import { Aside } from "./Aside";

const Content = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="content">
      <Aside onDateSelect={setSelectedDate} selectedDate={selectedDate} />
      <Main selectedDate={selectedDate} />
    </div>
  );
};

export default Content;
