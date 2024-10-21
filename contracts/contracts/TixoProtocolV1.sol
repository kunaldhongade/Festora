// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TixoProtocolV1 is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _eventIds;
    mapping(uint256 => Counters.Counter) private _ticketIds;
    mapping(uint256 => uint256) private _ticketPrices;
    mapping(uint256 => uint256) private _maxTickets;
    mapping(uint256 => address payable) private _eventOwners;

    string public collectionURI;

    event EventCreated(
        uint256 indexed eventId,
        address indexed eventOwner,
        uint256 ticketPrice,
        uint256 maxTickets
    );
    event TicketMinted(
        uint256 ticketId,
        address indexed recipient,
        uint256 indexed eventId
    );
    event CollectionURIUpdated(string newURI);

    constructor() ERC721("Tixo Protocol v1", "TIXO") {}

    function createEvent(
        uint256 ticketPrice,
        uint256 maxTickets
    ) public returns (uint256) {
        _eventIds.increment();
        uint256 newEventId = _eventIds.current();
        _ticketIds[newEventId] = Counters.Counter(0);
        _ticketPrices[newEventId] = ticketPrice;
        _maxTickets[newEventId] = maxTickets;
        _eventOwners[newEventId] = payable(msg.sender);

        emit EventCreated(newEventId, msg.sender, ticketPrice, maxTickets);

        return newEventId;
    }

    function mintWithTokenURI(
        address recipient,
        uint256 eventId,
        string memory tokenURI
    ) public payable returns (uint256) {
        require(eventId <= _eventIds.current(), "Event does not exist");
        require(msg.value == _ticketPrices[eventId], "Incorrect ticket price");
        require(
            _ticketIds[eventId].current() < _maxTickets[eventId],
            "All tickets for this event have been minted"
        );

        _ticketIds[eventId].increment();
        uint256 newTicketId = _ticketIds[eventId].current();

        // Use eventId and ticketId to create a unique identifier for each ticket
        uint256 uniqueTicketIdentifier = eventId * 10 ** 5 + newTicketId; // Assumes ticketId is less than 10**5
        _mint(recipient, uniqueTicketIdentifier);
        _setTokenURI(uniqueTicketIdentifier, tokenURI);

        // Send the ticket value to the event owner
        _eventOwners[eventId].transfer(msg.value);

        emit TicketMinted(uniqueTicketIdentifier, recipient, eventId);

        return uniqueTicketIdentifier;
    }

    function getCollectionURI() external view returns (string memory) {
        return collectionURI;
    }

    function setCollectionURI(string memory _collectionURI) external onlyOwner {
        collectionURI = _collectionURI;
        emit CollectionURIUpdated(collectionURI);
    }

    function getLastEventId() external view returns (uint256) {
        return _eventIds.current();
    }

    function getLastTicketId(uint256 eventId) external view returns (uint256) {
        require(eventId <= _eventIds.current(), "Event does not exist");
        return _ticketIds[eventId].current();
    }

    function getTicketPrice(uint256 eventId) external view returns (uint256) {
        require(eventId <= _eventIds.current(), "Event does not exist");
        return _ticketPrices[eventId];
    }

    function getEventOwner(uint256 eventId) external view returns (address) {
        require(eventId <= _eventIds.current(), "Event does not exist");
        return _eventOwners[eventId];
    }
}
