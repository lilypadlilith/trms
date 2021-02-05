import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useHistory } from 'react-router-dom';

import TRRequest from './trrequest/trrequest';
import { AnyNsRecord } from "dns";

interface RequestListProps {
    // The list of fields in TRRequest to display
    fields: string[],
    // What the fields should be displayed as in the header
    fieldTitles: string[], 
    // Tell us what to call to get the data, expected to be asynchronous (service call/query)
    requestList: TRRequest[] | null,
    // What message should display if there are no requests
    emptyMessage: string,
    // Should there be buttons review the request?
    reviewButtons: boolean 
}

/**
 * Dynamically creates a table of TRRequests using the given props
 */
function RequestListComponent(props: RequestListProps) {
    const history = useHistory();

    function submitForm(e: any) {
        let index: number = Number((e.target as HTMLInputElement).name);
        history.push('/review/'+index);
    }

    return(
        (props. requestList && props.requestList.length) ? <Table bordered>
            <thead>
                <tr>
                    {props.fieldTitles.map((fieldTitle)=>{
                        return <th>{fieldTitle}</th>;
                    })}
                    {props.reviewButtons && <th></th>}
                </tr>
            </thead>
            <tbody>
                {props.requestList.map((request, index)=>{
                    return <tr>{
                        props.fields.map((fieldName)=>{
                            return <td>{(fieldName in request) && request[fieldName as keyof TRRequest]}</td>
                        })
                    } {props.reviewButtons && <td><Button name={`${index}`} variant='info' onClick={submitForm} block>
                    Review
                </Button></td>}</tr>;
                })}
            </tbody>
        </Table> : <h5>{props.emptyMessage}</h5>
    );
}

export default RequestListComponent;