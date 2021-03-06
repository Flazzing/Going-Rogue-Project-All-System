import React, { Component, useState, useEffect } from "react";
import firestore from "../../config/firestore";
import {
  Table,
  Menu,
  Icon,
  Button,
  MenuItem,
  Pagination,
  Header,
} from "semantic-ui-react";
import { Helmet } from "react-helmet";
import Page from "../Page";
import { Route, Link, Redirect, Switch, BrowserRouter } from "react-router-dom";
import { SpellInput } from "./CustomerAction/editDeleteCustomer";
import CustomerTableRows from "./customerTableRows";
import PageLimitSelection from "./CustomerPagesizeSelect";

function useSize() {
  const [collectionCount, setCollectionCount] = useState([]);
  firestore
    .collection("Customer")
    .get()
    .then((snapshot) => {
      const collectionCount = snapshot.size;
      setCollectionCount(collectionCount);
    });
  return collectionCount;
}

function useThefirstElement() {
  const [firstElement, setFirstElement] = useState("");
  useEffect(() => {
    firestore
      .collection("Customer")
      .orderBy("customerID")
      .limit(1)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          let id = doc.id;
          setFirstElement(id);
        });
      });
  }, []);

  return firstElement;
}

const ProjectList = () => {
  const [pagenumber, setPagenumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);

  const collectionCount = useSize();
  const firstElement = useThefirstElement();
  // console.log(firstElement);

  const handlePageChange = (event, data) => {
    const { activePage } = data;
    if (activePage != pagenumber) {
      setPagenumber(activePage);
    }
  };

  const onPageChange = (event, data) => {
    if (parseInt(data.value) !== pageLimit) {
      setPageLimit(parseInt(data.value));
    }
  };

  return (
    <React.Fragment>
      <Header as="h1" style={{ marginLeft: "43%" }}>
        Customer
      </Header>
      <PageLimitSelection
        limit={pageLimit.toString()}
        onChange={onPageChange}
      />
      Total Count: {collectionCount}
      <Table celled striped fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell> ID</Table.HeaderCell>
            <Table.HeaderCell> First Name</Table.HeaderCell>
            <Table.HeaderCell> Last Name</Table.HeaderCell>
            <Table.HeaderCell> Type</Table.HeaderCell>
            <Table.HeaderCell> Phone</Table.HeaderCell>
            <Table.HeaderCell> Email</Table.HeaderCell>
            <Table.HeaderCell> Address</Table.HeaderCell>
            <Table.HeaderCell> UserName</Table.HeaderCell>
            <Table.HeaderCell> Projects</Table.HeaderCell>
            <Table.HeaderCell> Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            <CustomerTableRows
              pagenumber={pagenumber}
              pageLimit={pageLimit}
              firstElement={firstElement}
            />
          }
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="10">
              <Pagination
                totalPages={Math.ceil(collectionCount / pageLimit)}
                activePage={pagenumber}
                onPageChange={handlePageChange}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
      <Link to="/home/addCustomer">
        <Button>New Customer</Button>
      </Link>
    </React.Fragment>
  );
};

export default ProjectList;
