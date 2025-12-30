import React from 'react';
import { cleanString, formatTableDate } from '../../utils/helpers';

const SurveyTable = ({ data, role, currentUserId, onAction }) => {
    return (
        <table className="survey-table">
            <thead>
                <tr>
                    <th>Filename</th>
                    <th>User / Role</th>
                    <th>Last Mod.</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {data.map(s => (
                    <tr key={s.id}>
                        <td>{s.generatedFileName}</td>
                        <td>
                            <strong>{s.submittedBy}</strong><br/>
                            <small>{s.submittedBy === 'admin' ? '🛡️ Admin' : '👤 Surveyor'}</small>
                        </td>
                        <td>{formatTableDate(s.lastModifiedTime)}</td>
                        <td>
                            <button onClick={() => onAction(s, 'view')}>View</button>
                            {/* USER ACCESS CHECK */}
                            {(role === 'admin' || s.submitter_id === currentUserId) && (
                                <button onClick={() => onAction(s, 'edit')}>Edit</button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
export default SurveyTable;