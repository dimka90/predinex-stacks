import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

// @ts-ignore
const { simnet } = globalThis;

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const alice = accounts.get("wallet_1")!;
const bob = accounts.get("wallet_2")!;
const charlie = accounts.get("wallet_3")!;

describe("NFT Token Contract", () => {
  describe("Token Metadata", () => {
    it("should return correct token name", () => {
      const result = simnet.callReadOnlyFn(
        "nft-token",
        "get-name",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.stringAscii("PredinexNFT"));
    });

    it("should return correct token symbol", () => {
      const result = simnet.callReadOnlyFn(
        "nft-token",
        "get-symbol",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.stringAscii("PNFT"));
    });

    it("should return correct initial total supply", () => {
      const result = simnet.callReadOnlyFn(
        "nft-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.uint(0));
    });

    it("should return contract URI", () => {
      const result = simnet.callReadOnlyFn(
        "nft-token",
        "get-contract-uri",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.stringAscii("https://predinex.com/contract"));
    });
  });

  describe("Minting", () => {
    it("should mint NFT successfully (owner only)", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Test NFT"),
          Cl.stringAscii("A test NFT for the collection"),
          Cl.stringAscii("https://example.com/image1.png")
        ],
        deployer
      );
      expect(result.result).toBeOk(Cl.uint(0));

      // Check owner
      const ownerResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-owner",
        [Cl.uint(0)],
        deployer
      );
      expect(ownerResult.result).toBeOk(Cl.some(Cl.principal(alice)));

      // Check total supply increased
      const supplyResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(supplyResult.result).toBeOk(Cl.uint(1));
    });

    it("should fail mint from non-owner", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Test NFT"),
          Cl.stringAscii("A test NFT for the collection"),
          Cl.stringAscii("https://example.com/image1.png")
        ],
        alice // Non-owner trying to mint
      );
      expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });

    it("should return correct token URI", () => {
      // First mint a token
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Test NFT"),
          Cl.stringAscii("A test NFT for the collection"),
          Cl.stringAscii("https://example.com/image1.png")
        ],
        deployer
      );

      const result = simnet.callReadOnlyFn(
        "nft-token",
        "get-token-uri",
        [Cl.uint(0)],
        deployer
      );
      expect(result.result).toBeOk(Cl.some(Cl.stringAscii("https://predinex.com/nft/0")));
    });

    it("should return token metadata", () => {
      // First mint a token
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Test NFT"),
          Cl.stringAscii("A test NFT for the collection"),
          Cl.stringAscii("https://example.com/image1.png")
        ],
        deployer
      );

      const result = simnet.callReadOnlyFn(
        "nft-token",
        "get-token-metadata",
        [Cl.uint(0)],
        deployer
      );
      expect(result.result).toBeOk(Cl.some(Cl.tuple({
        name: Cl.stringAscii("Test NFT"),
        description: Cl.stringAscii("A test NFT for the collection"),
        image: Cl.stringAscii("https://example.com/image1.png")
      })));
    });
  });

  describe("Transfer Functionality", () => {
    beforeEach(() => {
      // Mint a token to Alice for transfer tests
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Test NFT"),
          Cl.stringAscii("A test NFT for the collection"),
          Cl.stringAscii("https://example.com/image1.png")
        ],
        deployer
      );
    });

    it("should transfer NFT successfully", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(bob)],
        alice
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check new owner
      const ownerResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-owner",
        [Cl.uint(0)],
        deployer
      );
      expect(ownerResult.result).toBeOk(Cl.some(Cl.principal(bob)));
    });

    it("should fail transfer from non-owner", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(bob)],
        bob // Bob trying to transfer Alice's token
      );
      expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });

    it("should fail transfer of non-existent token", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(999), Cl.principal(alice), Cl.principal(bob)],
        alice
      );
      expect(result.result).toBeErr(Cl.uint(404)); // ERR-NOT-FOUND
    });
  });

  describe("Approval Functionality", () => {
    beforeEach(() => {
      // Mint a token to Alice for approval tests
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Test NFT"),
          Cl.stringAscii("A test NFT for the collection"),
          Cl.stringAscii("https://example.com/image1.png")
        ],
        deployer
      );
    });

    it("should approve spender successfully", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(0)],
        alice
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check approval
      const approvedResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-approved",
        [Cl.uint(0)],
        deployer
      );
      expect(approvedResult.result).toBeOk(Cl.some(Cl.principal(bob)));
    });

    it("should transfer-from with valid approval", () => {
      // First approve Bob
      simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(0)],
        alice
      );

      // Bob transfers from Alice to Charlie
      const result = simnet.callPublicFn(
        "nft-token",
        "transfer-from",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(charlie)],
        bob
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check new owner
      const ownerResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-owner",
        [Cl.uint(0)],
        deployer
      );
      expect(ownerResult.result).toBeOk(Cl.some(Cl.principal(charlie)));

      // Check approval is cleared
      const approvedResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-approved",
        [Cl.uint(0)],
        deployer
      );
      expect(approvedResult.result).toBeOk(Cl.none());
    });

    it("should set approval for all", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "set-approval-for-all",
        [Cl.principal(bob), Cl.bool(true)],
        alice
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check approval for all
      const approvalResult = simnet.callReadOnlyFn(
        "nft-token",
        "is-approved-for-all-read",
        [Cl.principal(alice), Cl.principal(bob)],
        deployer
      );
      expect(approvalResult.result).toBeOk(Cl.bool(true));
    });
  });

  describe("Burn Functionality", () => {
    beforeEach(() => {
      // Mint a token to Alice for burn tests
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Test NFT"),
          Cl.stringAscii("A test NFT for the collection"),
          Cl.stringAscii("https://example.com/image1.png")
        ],
        deployer
      );
    });

    it("should burn NFT successfully", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "burn",
        [Cl.uint(0)],
        alice
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check token no longer exists
      const ownerResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-owner",
        [Cl.uint(0)],
        deployer
      );
      expect(ownerResult.result).toBeOk(Cl.none());

      // Check metadata is cleared
      const metadataResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-token-metadata",
        [Cl.uint(0)],
        deployer
      );
      expect(metadataResult.result).toBeOk(Cl.none());
    });

    it("should fail burn from non-owner", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "burn",
        [Cl.uint(0)],
        bob // Bob trying to burn Alice's token
      );
      expect(result.result).toBeErr(Cl.uint(403)); // ERR-NOT-OWNER
    });
  });
});