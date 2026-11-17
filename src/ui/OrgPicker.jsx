import { useOrg } from '../store/org-context-object.js';

export default function OrgPicker() {
  const { orgs, currentOrgId, setCurrentOrgId } = useOrg();

  return (
    <select value={currentOrgId} onChange={(e) => setCurrentOrgId(e.target.value)} aria-label="Organization">
      {orgs.map((org) => (
        <option key={org.id} value={org.id}>
          {org.name}
        </option>
      ))}
    </select>
  );
}
