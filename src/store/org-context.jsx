import { useState } from 'react';

import { OrgContext } from './org-context-object.js';

export function OrgProvider({ orgs, children }) {
  const saved = localStorage.getItem('currentOrgId');
  const initial = orgs.some(o => o.id === saved) ? saved : orgs[0]?.id ?? '';
  const [currentOrgId, setOrgId] = useState(initial);

  function setCurrentOrgId(id) {
    localStorage.setItem('currentOrgId', id);
    setOrgId(id);
  }

  return (
    <OrgContext.Provider value={{ orgs, currentOrgId, setCurrentOrgId }}>
      {children}
    </OrgContext.Provider>
  );
}
