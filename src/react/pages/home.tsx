import React, { useEffect, useState } from 'react'
import { VersionList } from '../../interfaces'

export function Home()
{
    const [versions, setVersions] = useState<VersionList | null>(null);
    const [error, setError] = useState<string>();

    useEffect(() => {
        console.log(123)

        window.electronAPI.sendMessage('versions', "");

        window.electronAPI.onMessage('responseVersions', (args)=>{
            console.log(args)
                try{
                    setVersions(args);
                }
                catch{
                    setError("123123");
                }
        });

    }, [])
    return (
        <div>
            <h1>123213</h1>
            {versions && (
                <div>
                    <h2>Latest: {versions.latest.release}</h2>
                    <h3>Available Versions:</h3>
                    <ul>
                        {versions.versions.map((version) => (
                            <li key={version.id}>{version.id} ({version.type})</li>
                        ))}
                    </ul>
                </div>
            )}
            {error && <h2>{error}</h2>}
        </div>
    )
}