import React from 'react';
import numeral from 'numeral';
import './Table.css';

function Table({ countries }) {
    return (
        <div className="table">
            <th>Countries</th>
            <th></th>
            <th>Confirmed</th>
            <th>Recovered</th>
            <th>Deaths</th>
            {countries.map(({ country, cases, recovered, deaths, ...props }, index) => (
                <tr key={index}>
                    <td>{country}</td>
                    <td><img src={props.countryInfo.flag} alt={country} height="12" width="15" style={{ borderRadius: "3px", marginLeft: "5px" }} /></td>
                    <td><strong>{numeral(cases).format("0,0")}</strong></td>
                    <td><strong>{numeral(recovered).format("0,0")}</strong></td>
                    <td><strong>{numeral(deaths).format("0,0")}</strong></td>
                </tr>
            ))}
        </div>
    )
}

export default Table