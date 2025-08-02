"use client";

import TemplateDashboard from "../../components/templates/TemplateDashboard";

const TemplatesPage = () => {
  return (

    <TemplateDashboard
      title="Templates"
      subtitle="View and manage all templates for City General Hospital"
      onNewTemplate={() => console.log("New Template clicked")}
    />

  );
};

export default TemplatesPage;