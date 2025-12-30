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

    it("should transfer-from with approval-for-all", () => {
      // Set approval for all
      simnet.callPublicFn(
        "nft-token",
        "set-approval-for-all",
        [Cl.principal(bob), Cl.bool(true)],
        alice
      );

      // Bob transfers from Alice to Charlie using approval-for-all
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
    });

    it("should revoke approval for all", () => {
      // First set approval for all
      simnet.callPublicFn(
        "nft-token",
        "set-approval-for-all",
        [Cl.principal(bob), Cl.bool(true)],
        alice
      );

      // Then revoke it
      const result = simnet.callPublicFn(
        "nft-token",
        "set-approval-for-all",
        [Cl.principal(bob), Cl.bool(false)],
        alice
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check approval for all is revoked
      const approvalResult = simnet.callReadOnlyFn(
        "nft-token",
        "is-approved-for-all-read",
        [Cl.principal(alice), Cl.principal(bob)],
        deployer
      );
      expect(approvalResult.result).toBeOk(Cl.bool(false));
    });

    it("should fail approve from non-owner", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(charlie), Cl.uint(0)],
        bob // Bob trying to approve for Alice's token
      );
      expect(result.result).toBeErr(Cl.uint(403)); // ERR-NOT-OWNER
    });

    it("should fail transfer-from without approval", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "transfer-from",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(charlie)],
        bob // Bob trying to transfer without approval
      );
      expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });

    it("should fail approve non-existent token", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(999)],
        alice
      );
      expect(result.result).toBeErr(Cl.uint(404)); // ERR-NOT-FOUND
    });
  });

  describe("Safe Transfer Functionality", () => {
    beforeEach(() => {
      // Mint a token to Alice for safe transfer tests
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

    it("should safe transfer with data successfully", () => {
      const testData = new TextEncoder().encode("test data");
      const result = simnet.callPublicFn(
        "nft-token",
        "safe-transfer-from",
        [
          Cl.uint(0),
          Cl.principal(alice),
          Cl.principal(bob),
          Cl.buffer(testData)
        ],
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

    it("should safe transfer with approval", () => {
      // First approve Bob
      simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(0)],
        alice
      );

      const testData = new TextEncoder().encode("approved transfer");
      const result = simnet.callPublicFn(
        "nft-token",
        "safe-transfer-from",
        [
          Cl.uint(0),
          Cl.principal(alice),
          Cl.principal(charlie),
          Cl.buffer(testData)
        ],
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
    });

    it("should fail safe transfer without authorization", () => {
      const testData = new TextEncoder().encode("unauthorized");
      const result = simnet.callPublicFn(
        "nft-token",
        "safe-transfer-from",
        [
          Cl.uint(0),
          Cl.principal(alice),
          Cl.principal(bob),
          Cl.buffer(testData)
        ],
        bob // Bob trying to transfer without approval
      );
      expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });
  });

  describe("Token Existence and Balance", () => {
    it("should check token existence correctly", () => {
      // Check non-existent token
      const nonExistentResult = simnet.callReadOnlyFn(
        "nft-token",
        "token-exists",
        [Cl.uint(0)],
        deployer
      );
      expect(nonExistentResult.result).toBeBool(false);

      // Mint a token
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

      // Check existing token
      const existentResult = simnet.callReadOnlyFn(
        "nft-token",
        "token-exists",
        [Cl.uint(0)],
        deployer
      );
      expect(existentResult.result).toBeBool(true);
    });

    it("should return correct balance for owner", () => {
      // Initial balance should be 0
      const initialBalance = simnet.callReadOnlyFn(
        "nft-token",
        "balance-of",
        [Cl.principal(alice)],
        deployer
      );
      expect(initialBalance.result).toBeOk(Cl.tuple({ owner: Cl.principal(alice), count: Cl.uint(0) }));

      // Mint multiple tokens to Alice
      for (let i = 0; i < 3; i++) {
        simnet.callPublicFn(
          "nft-token",
          "mint",
          [
            Cl.principal(alice),
            Cl.stringAscii(`NFT ${i}`),
            Cl.stringAscii(`Description ${i}`),
            Cl.stringAscii(`image${i}.png`)
          ],
          deployer
        );
      }

      // Check balance after minting
      const finalBalance = simnet.callReadOnlyFn(
        "nft-token",
        "balance-of",
        [Cl.principal(alice)],
        deployer
      );
      expect(finalBalance.result).toBeOk(Cl.tuple({ owner: Cl.principal(alice), count: Cl.uint(3) }));
    });
  });

  describe("Contract URI Management", () => {
    it("should update contract URI successfully (owner only)", () => {
      const newUri = "https://newdomain.com/contract";
      const result = simnet.callPublicFn(
        "nft-token",
        "set-contract-uri",
        [Cl.stringAscii(newUri)],
        deployer
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check updated URI
      const uriResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-contract-uri",
        [],
        deployer
      );
      expect(uriResult.result).toBeOk(Cl.stringAscii(newUri));
    });

    it("should fail contract URI update from non-owner", () => {
      const newUri = "https://malicious.com/contract";
      const result = simnet.callPublicFn(
        "nft-token",
        "set-contract-uri",
        [Cl.stringAscii(newUri)],
        alice // Non-owner trying to update
      );
      expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle maximum string lengths", () => {
      const maxName = "A".repeat(64);
      const maxDescription = "B".repeat(256);
      const maxImage = "C".repeat(256);

      const result = simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii(maxName),
          Cl.stringAscii(maxDescription),
          Cl.stringAscii(maxImage)
        ],
        deployer
      );
      expect(result.result).toBeOk(Cl.uint(0));

      // Verify metadata was stored correctly
      const metadataResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-token-metadata",
        [Cl.uint(0)],
        deployer
      );
      expect(metadataResult.result).toBeOk(Cl.some(Cl.tuple({
        name: Cl.stringAscii(maxName),
        description: Cl.stringAscii(maxDescription),
        image: Cl.stringAscii(maxImage)
      })));
    });

    it("should handle empty metadata strings", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii(""),
          Cl.stringAscii(""),
          Cl.stringAscii("")
        ],
        deployer
      );
      expect(result.result).toBeOk(Cl.uint(0));

      // Verify empty metadata was stored
      const metadataResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-token-metadata",
        [Cl.uint(0)],
        deployer
      );
      expect(metadataResult.result).toBeOk(Cl.some(Cl.tuple({
        name: Cl.stringAscii(""),
        description: Cl.stringAscii(""),
        image: Cl.stringAscii("")
      })));
    });

    it("should handle self-transfer", () => {
      // Mint token to Alice
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Self Transfer NFT"),
          Cl.stringAscii("Testing self transfer"),
          Cl.stringAscii("self.png")
        ],
        deployer
      );

      // Alice transfers to herself
      const result = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(alice)],
        alice
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Verify Alice still owns the token
      const ownerResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-owner",
        [Cl.uint(0)],
        deployer
      );
      expect(ownerResult.result).toBeOk(Cl.some(Cl.principal(alice)));
    });

    it("should handle multiple approvals for same token", () => {
      // Mint token to Alice
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Multi Approval NFT"),
          Cl.stringAscii("Testing multiple approvals"),
          Cl.stringAscii("multi.png")
        ],
        deployer
      );

      // Approve Bob
      simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(0)],
        alice
      );

      // Approve Charlie (should overwrite Bob's approval)
      const result = simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(charlie), Cl.uint(0)],
        alice
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check that Charlie is now approved
      const approvedResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-approved",
        [Cl.uint(0)],
        deployer
      );
      expect(approvedResult.result).toBeOk(Cl.some(Cl.principal(charlie)));

      // Bob should no longer be able to transfer
      const bobTransferResult = simnet.callPublicFn(
        "nft-token",
        "transfer-from",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(bob)],
        bob
      );
      expect(bobTransferResult.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete NFT lifecycle", () => {
      // 1. Mint NFT
      const mintResult = simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Lifecycle NFT"),
          Cl.stringAscii("Testing complete lifecycle"),
          Cl.stringAscii("lifecycle.png")
        ],
        deployer
      );
      expect(mintResult.result).toBeOk(Cl.uint(0));

      // 2. Approve Bob
      const approveResult = simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(0)],
        alice
      );
      expect(approveResult.result).toBeOk(Cl.bool(true));

      // 3. Bob transfers to Charlie
      const transferResult = simnet.callPublicFn(
        "nft-token",
        "transfer-from",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(charlie)],
        bob
      );
      expect(transferResult.result).toBeOk(Cl.bool(true));

      // 4. Charlie burns the NFT
      const burnResult = simnet.callPublicFn(
        "nft-token",
        "burn",
        [Cl.uint(0)],
        charlie
      );
      expect(burnResult.result).toBeOk(Cl.bool(true));

      // 5. Verify NFT no longer exists
      const existsResult = simnet.callReadOnlyFn(
        "nft-token",
        "token-exists",
        [Cl.uint(0)],
        deployer
      );
      expect(existsResult.result).toBeBool(false);
    });

    it("should handle multiple NFT operations", () => {
      // Mint multiple NFTs to different owners
      const recipients = [alice, bob, charlie];
      const tokenIds: number[] = [];

      for (let i = 0; i < recipients.length; i++) {
        const result = simnet.callPublicFn(
          "nft-token",
          "mint",
          [
            Cl.principal(recipients[i]),
            Cl.stringAscii(`Multi NFT ${i}`),
            Cl.stringAscii(`Description ${i}`),
            Cl.stringAscii(`image${i}.png`)
          ],
          deployer
        );
        expect(result.result).toBeOk(Cl.uint(i));
        tokenIds.push(i);
      }

      // Set up cross-approvals
      simnet.callPublicFn(
        "nft-token",
        "set-approval-for-all",
        [Cl.principal(bob), Cl.bool(true)],
        alice
      );

      simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(charlie), Cl.uint(1)],
        bob
      );

      // Execute transfers
      const transfer1 = simnet.callPublicFn(
        "nft-token",
        "transfer-from",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(charlie)],
        bob
      );
      expect(transfer1.result).toBeOk(Cl.bool(true));

      const transfer2 = simnet.callPublicFn(
        "nft-token",
        "transfer-from",
        [Cl.uint(1), Cl.principal(bob), Cl.principal(alice)],
        charlie
      );
      expect(transfer2.result).toBeOk(Cl.bool(true));

      // Verify final ownership
      const owner0 = simnet.callReadOnlyFn(
        "nft-token",
        "get-owner",
        [Cl.uint(0)],
        deployer
      );
      expect(owner0.result).toBeOk(Cl.some(Cl.principal(charlie)));

      const owner1 = simnet.callReadOnlyFn(
        "nft-token",
        "get-owner",
        [Cl.uint(1)],
        deployer
      );
      expect(owner1.result).toBeOk(Cl.some(Cl.principal(alice)));

      const owner2 = simnet.callReadOnlyFn(
        "nft-token",
        "get-owner",
        [Cl.uint(2)],
        deployer
      );
      expect(owner2.result).toBeOk(Cl.some(Cl.principal(charlie)));
    });

    it("should handle batch operations with mixed success", () => {
      // Create a scenario where some operations succeed and others fail
      const recipients = [alice, bob, charlie];
      const names = ["Valid 1", "Valid 2", "Valid 3"];
      const descriptions = ["Desc 1", "Desc 2", "Desc 3"];
      const images = ["img1.png", "img2.png", "img3.png"];

      // Batch mint should succeed
      const batchResult = simnet.callPublicFn(
        "nft-token",
        "batch-mint",
        [
          Cl.list(recipients.map(r => Cl.principal(r))),
          Cl.list(names.map(n => Cl.stringAscii(n))),
          Cl.list(descriptions.map(d => Cl.stringAscii(d))),
          Cl.list(images.map(i => Cl.stringAscii(i)))
        ],
        deployer
      );
      expect(batchResult.result).toBeOk();

      // Try to transfer non-existent token (should fail)
      const invalidTransfer = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(999), Cl.principal(alice), Cl.principal(bob)],
        alice
      );
      expect(invalidTransfer.result).toBeErr(Cl.uint(404));

      // Valid transfers should still work
      const validTransfer = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(bob)],
        alice
      );
      expect(validTransfer.result).toBeOk(Cl.bool(true));
    });
  });

  describe("Performance and Stress Tests", () => {
    it("should handle maximum batch mint size", () => {
      const maxSize = 10;
      const recipients = Array(maxSize).fill(0).map((_, i) => 
        i % 3 === 0 ? alice : i % 3 === 1 ? bob : charlie
      );
      const names = Array(maxSize).fill(0).map((_, i) => `Batch NFT ${i}`);
      const descriptions = Array(maxSize).fill(0).map((_, i) => `Batch description ${i}`);
      const images = Array(maxSize).fill(0).map((_, i) => `batch${i}.png`);

      const result = simnet.callPublicFn(
        "nft-token",
        "batch-mint",
        [
          Cl.list(recipients.map(r => Cl.principal(r))),
          Cl.list(names.map(n => Cl.stringAscii(n))),
          Cl.list(descriptions.map(d => Cl.stringAscii(d))),
          Cl.list(images.map(i => Cl.stringAscii(i)))
        ],
        deployer
      );
      expect(result.result).toBeOk();

      // Verify total supply
      const supplyResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(supplyResult.result).toBeOk(Cl.uint(maxSize));
    });

    it("should handle rapid sequential operations", () => {
      // Mint multiple tokens rapidly
      for (let i = 0; i < 5; i++) {
        const result = simnet.callPublicFn(
          "nft-token",
          "mint",
          [
            Cl.principal(alice),
            Cl.stringAscii(`Rapid NFT ${i}`),
            Cl.stringAscii(`Rapid description ${i}`),
            Cl.stringAscii(`rapid${i}.png`)
          ],
          deployer
        );
        expect(result.result).toBeOk(Cl.uint(i));
      }

      // Rapid transfers
      for (let i = 0; i < 5; i++) {
        const result = simnet.callPublicFn(
          "nft-token",
          "transfer",
          [Cl.uint(i), Cl.principal(alice), Cl.principal(bob)],
          alice
        );
        expect(result.result).toBeOk(Cl.bool(true));
      }

      // Verify all transfers completed
      for (let i = 0; i < 5; i++) {
        const ownerResult = simnet.callReadOnlyFn(
          "nft-token",
          "get-owner",
          [Cl.uint(i)],
          deployer
        );
        expect(ownerResult.result).toBeOk(Cl.some(Cl.principal(bob)));
      }
    });

    it("should maintain data integrity under stress", () => {
      const numTokens = 8;
      
      // Mint tokens to different owners
      for (let i = 0; i < numTokens; i++) {
        const owner = i % 2 === 0 ? alice : bob;
        simnet.callPublicFn(
          "nft-token",
          "mint",
          [
            Cl.principal(owner),
            Cl.stringAscii(`Stress NFT ${i}`),
            Cl.stringAscii(`Stress test token ${i}`),
            Cl.stringAscii(`stress${i}.png`)
          ],
          deployer
        );
      }

      // Set up complex approval patterns
      for (let i = 0; i < numTokens; i += 2) {
        simnet.callPublicFn(
          "nft-token",
          "approve",
          [Cl.principal(charlie), Cl.uint(i)],
          alice
        );
      }

      simnet.callPublicFn(
        "nft-token",
        "set-approval-for-all",
        [Cl.principal(alice), Cl.bool(true)],
        bob
      );

      // Execute complex transfer patterns
      for (let i = 0; i < numTokens; i += 2) {
        const result = simnet.callPublicFn(
          "nft-token",
          "transfer-from",
          [Cl.uint(i), Cl.principal(alice), Cl.principal(charlie)],
          charlie
        );
        expect(result.result).toBeOk(Cl.bool(true));
      }

      // Verify final state consistency
      const totalSupply = simnet.callReadOnlyFn(
        "nft-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(totalSupply.result).toBeOk(Cl.uint(numTokens));

      // Check that all tokens still exist and have correct owners
      for (let i = 0; i < numTokens; i++) {
        const exists = simnet.callReadOnlyFn(
          "nft-token",
          "token-exists",
          [Cl.uint(i)],
          deployer
        );
        expect(exists.result).toBeBool(true);

        const owner = simnet.callReadOnlyFn(
          "nft-token",
          "get-owner",
          [Cl.uint(i)],
          deployer
        );
        expect(owner.result).toBeOk(Cl.some(Cl.principal(
          i % 2 === 0 ? charlie : bob
        )));
      }
    });
  });

  describe("Security and Access Control", () => {
    it("should prevent unauthorized minting", () => {
      const unauthorizedUsers = [alice, bob, charlie];
      
      for (const user of unauthorizedUsers) {
        const result = simnet.callPublicFn(
          "nft-token",
          "mint",
          [
            Cl.principal(alice),
            Cl.stringAscii("Unauthorized NFT"),
            Cl.stringAscii("Should not be minted"),
            Cl.stringAscii("unauthorized.png")
          ],
          user
        );
        expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
      }

      // Verify no tokens were minted
      const totalSupply = simnet.callReadOnlyFn(
        "nft-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(totalSupply.result).toBeOk(Cl.uint(0));
    });

    it("should prevent unauthorized contract URI updates", () => {
      const unauthorizedUsers = [alice, bob, charlie];
      const maliciousUri = "https://malicious.com/fake-contract";
      
      for (const user of unauthorizedUsers) {
        const result = simnet.callPublicFn(
          "nft-token",
          "set-contract-uri",
          [Cl.stringAscii(maliciousUri)],
          user
        );
        expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
      }

      // Verify URI remains unchanged
      const uriResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-contract-uri",
        [],
        deployer
      );
      expect(uriResult.result).toBeOk(Cl.stringAscii("https://predinex.com/contract"));
    });

    it("should prevent unauthorized batch minting", () => {
      const recipients = [alice, bob];
      const names = ["Hack 1", "Hack 2"];
      const descriptions = ["Hacked NFT 1", "Hacked NFT 2"];
      const images = ["hack1.png", "hack2.png"];

      const result = simnet.callPublicFn(
        "nft-token",
        "batch-mint",
        [
          Cl.list(recipients.map(r => Cl.principal(r))),
          Cl.list(names.map(n => Cl.stringAscii(n))),
          Cl.list(descriptions.map(d => Cl.stringAscii(d))),
          Cl.list(images.map(i => Cl.stringAscii(i)))
        ],
        alice // Non-owner attempting batch mint
      );
      expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });

    it("should enforce ownership for transfers", () => {
      // Mint token to Alice
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Ownership Test NFT"),
          Cl.stringAscii("Testing ownership enforcement"),
          Cl.stringAscii("ownership.png")
        ],
        deployer
      );

      // Bob tries to transfer Alice's token without approval
      const unauthorizedTransfer = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(bob)],
        bob
      );
      expect(unauthorizedTransfer.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED

      // Charlie tries to transfer Alice's token claiming to be Alice
      const spoofedTransfer = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(charlie)],
        charlie
      );
      expect(spoofedTransfer.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED

      // Verify Alice still owns the token
      const ownerResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-owner",
        [Cl.uint(0)],
        deployer
      );
      expect(ownerResult.result).toBeOk(Cl.some(Cl.principal(alice)));
    });

    it("should prevent double-spending through approval manipulation", () => {
      // Mint token to Alice
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Double Spend Test"),
          Cl.stringAscii("Testing double spend prevention"),
          Cl.stringAscii("doublespend.png")
        ],
        deployer
      );

      // Alice approves Bob
      simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(0)],
        alice
      );

      // Bob transfers to Charlie
      const firstTransfer = simnet.callPublicFn(
        "nft-token",
        "transfer-from",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(charlie)],
        bob
      );
      expect(firstTransfer.result).toBeOk(Cl.bool(true));

      // Bob tries to transfer again (should fail - approval cleared)
      const secondTransfer = simnet.callPublicFn(
        "nft-token",
        "transfer-from",
        [Cl.uint(0), Cl.principal(charlie), Cl.principal(bob)],
        bob
      );
      expect(secondTransfer.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED

      // Verify Charlie owns the token
      const ownerResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-owner",
        [Cl.uint(0)],
        deployer
      );
      expect(ownerResult.result).toBeOk(Cl.some(Cl.principal(charlie)));
    });
  });

  describe("Event Emission and State Consistency", () => {
    it("should emit transfer events correctly", () => {
      // Mint token to Alice
      const mintResult = simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Event Test NFT"),
          Cl.stringAscii("Testing event emission"),
          Cl.stringAscii("event.png")
        ],
        deployer
      );
      expect(mintResult.result).toBeOk(Cl.uint(0));

      // Check mint event was emitted
      expect(mintResult.events).toHaveLength(1);
      expect(mintResult.events[0].event).toBe("print");

      // Transfer token
      const transferResult = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(bob)],
        alice
      );
      expect(transferResult.result).toBeOk(Cl.bool(true));

      // Check transfer event was emitted
      expect(transferResult.events).toHaveLength(1);
      expect(transferResult.events[0].event).toBe("print");
    });

    it("should emit approval events correctly", () => {
      // Mint token to Alice
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Approval Event NFT"),
          Cl.stringAscii("Testing approval events"),
          Cl.stringAscii("approval.png")
        ],
        deployer
      );

      // Approve Bob
      const approveResult = simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(0)],
        alice
      );
      expect(approveResult.result).toBeOk(Cl.bool(true));

      // Check approval event was emitted
      expect(approveResult.events).toHaveLength(1);
      expect(approveResult.events[0].event).toBe("print");
    });

    it("should emit approval-for-all events correctly", () => {
      const approvalResult = simnet.callPublicFn(
        "nft-token",
        "set-approval-for-all",
        [Cl.principal(bob), Cl.bool(true)],
        alice
      );
      expect(approvalResult.result).toBeOk(Cl.bool(true));

      // Check approval-for-all event was emitted
      expect(approvalResult.events).toHaveLength(1);
      expect(approvalResult.events[0].event).toBe("print");
    });

    it("should maintain consistent state across operations", () => {
      const initialSupply = simnet.callReadOnlyFn(
        "nft-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(initialSupply.result).toBeOk(Cl.uint(0));

      // Mint 3 tokens
      for (let i = 0; i < 3; i++) {
        simnet.callPublicFn(
          "nft-token",
          "mint",
          [
            Cl.principal(alice),
            Cl.stringAscii(`Consistency NFT ${i}`),
            Cl.stringAscii(`Testing consistency ${i}`),
            Cl.stringAscii(`consistency${i}.png`)
          ],
          deployer
        );
      }

      // Check supply increased correctly
      const afterMintSupply = simnet.callReadOnlyFn(
        "nft-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(afterMintSupply.result).toBeOk(Cl.uint(3));

      // Transfer one token
      simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(bob)],
        alice
      );

      // Supply should remain the same after transfer
      const afterTransferSupply = simnet.callReadOnlyFn(
        "nft-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(afterTransferSupply.result).toBeOk(Cl.uint(3));

      // Burn one token
      simnet.callPublicFn(
        "nft-token",
        "burn",
        [Cl.uint(1)],
        alice
      );

      // Supply should remain the same (counter doesn't decrease)
      const afterBurnSupply = simnet.callReadOnlyFn(
        "nft-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(afterBurnSupply.result).toBeOk(Cl.uint(3));

      // But token should not exist
      const tokenExists = simnet.callReadOnlyFn(
        "nft-token",
        "token-exists",
        [Cl.uint(1)],
        deployer
      );
      expect(tokenExists.result).toBeBool(false);
    });

    it("should handle state transitions correctly", () => {
      // Mint token
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("State Transition NFT"),
          Cl.stringAscii("Testing state transitions"),
          Cl.stringAscii("state.png")
        ],
        deployer
      );

      // Initial state: Alice owns, no approvals
      let owner = simnet.callReadOnlyFn("nft-token", "get-owner", [Cl.uint(0)], deployer);
      let approved = simnet.callReadOnlyFn("nft-token", "get-approved", [Cl.uint(0)], deployer);
      expect(owner.result).toBeOk(Cl.some(Cl.principal(alice)));
      expect(approved.result).toBeOk(Cl.none());

      // State transition: Add approval
      simnet.callPublicFn("nft-token", "approve", [Cl.principal(bob), Cl.uint(0)], alice);
      
      approved = simnet.callReadOnlyFn("nft-token", "get-approved", [Cl.uint(0)], deployer);
      expect(approved.result).toBeOk(Cl.some(Cl.principal(bob)));

      // State transition: Transfer (should clear approval)
      simnet.callPublicFn("nft-token", "transfer-from", [Cl.uint(0), Cl.principal(alice), Cl.principal(charlie)], bob);
      
      owner = simnet.callReadOnlyFn("nft-token", "get-owner", [Cl.uint(0)], deployer);
      approved = simnet.callReadOnlyFn("nft-token", "get-approved", [Cl.uint(0)], deployer);
      expect(owner.result).toBeOk(Cl.some(Cl.principal(charlie)));
      expect(approved.result).toBeOk(Cl.none());

      // State transition: Burn (should clear all data)
      simnet.callPublicFn("nft-token", "burn", [Cl.uint(0)], charlie);
      
      owner = simnet.callReadOnlyFn("nft-token", "get-owner", [Cl.uint(0)], deployer);
      const metadata = simnet.callReadOnlyFn("nft-token", "get-token-metadata", [Cl.uint(0)], deployer);
      expect(owner.result).toBeOk(Cl.none());
      expect(metadata.result).toBeOk(Cl.none());
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

    it("should fail burn of non-existent token", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "burn",
        [Cl.uint(999)],
        alice
      );
      expect(result.result).toBeErr(Cl.uint(404)); // ERR-NOT-FOUND
    });

    it("should clear approvals when burning", () => {
      // First approve Bob
      simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(0)],
        alice
      );

      // Verify approval exists
      const approvedResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-approved",
        [Cl.uint(0)],
        deployer
      );
      expect(approvedResult.result).toBeOk(Cl.some(Cl.principal(bob)));

      // Burn the token
      simnet.callPublicFn(
        "nft-token",
        "burn",
        [Cl.uint(0)],
        alice
      );

      // Check approval is cleared (token doesn't exist)
      const clearedApprovalResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-approved",
        [Cl.uint(0)],
        deployer
      );
      expect(clearedApprovalResult.result).toBeOk(Cl.none());
    });
  });

  describe("Batch Minting", () => {
    it("should batch mint multiple NFTs successfully", () => {
      const recipients = [alice, bob, charlie];
      const names = ["NFT 1", "NFT 2", "NFT 3"];
      const descriptions = ["First NFT", "Second NFT", "Third NFT"];
      const images = ["image1.png", "image2.png", "image3.png"];

      const result = simnet.callPublicFn(
        "nft-token",
        "batch-mint",
        [
          Cl.list(recipients.map(r => Cl.principal(r))),
          Cl.list(names.map(n => Cl.stringAscii(n))),
          Cl.list(descriptions.map(d => Cl.stringAscii(d))),
          Cl.list(images.map(i => Cl.stringAscii(i)))
        ],
        deployer
      );
      expect(result.result).toBeOk();

      // Check total supply increased by 3
      const supplyResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(supplyResult.result).toBeOk(Cl.uint(3));

      // Check each token has correct owner
      for (let i = 0; i < recipients.length; i++) {
        const ownerResult = simnet.callReadOnlyFn(
          "nft-token",
          "get-owner",
          [Cl.uint(i)],
          deployer
        );
        expect(ownerResult.result).toBeOk(Cl.some(Cl.principal(recipients[i])));
      }
    });

    it("should fail batch mint from non-owner", () => {
      const recipients = [alice, bob];
      const names = ["NFT 1", "NFT 2"];
      const descriptions = ["First NFT", "Second NFT"];
      const images = ["image1.png", "image2.png"];

      const result = simnet.callPublicFn(
        "nft-token",
        "batch-mint",
        [
          Cl.list(recipients.map(r => Cl.principal(r))),
          Cl.list(names.map(n => Cl.stringAscii(n))),
          Cl.list(descriptions.map(d => Cl.stringAscii(d))),
          Cl.list(images.map(i => Cl.stringAscii(i)))
        ],
        alice // Non-owner trying to batch mint
      );
      expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });

    it("should fail batch mint with mismatched array lengths", () => {
      const recipients = [alice, bob];
      const names = ["NFT 1"]; // Different length
      const descriptions = ["First NFT", "Second NFT"];
      const images = ["image1.png", "image2.png"];

      const result = simnet.callPublicFn(
        "nft-token",
        "batch-mint",
        [
          Cl.list(recipients.map(r => Cl.principal(r))),
          Cl.list(names.map(n => Cl.stringAscii(n))),
          Cl.list(descriptions.map(d => Cl.stringAscii(d))),
          Cl.list(images.map(i => Cl.stringAscii(i)))
        ],
        deployer
      );
      expect(result.result).toBeErr(Cl.uint(400)); // ERR-INVALID-TOKEN-ID
    });
  });
});
  describe("Error Handling and Boundary Conditions", () => {
    it("should handle token ID boundary conditions", () => {
      // Test with token ID 0 (should work)
      const result0 = simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Token 0"),
          Cl.stringAscii("First token"),
          Cl.stringAscii("token0.png")
        ],
        deployer
      );
      expect(result0.result).toBeOk(Cl.uint(0));

      // Test operations on non-existent high token ID
      const highTokenId = 999999;
      const transferResult = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(highTokenId), Cl.principal(alice), Cl.principal(bob)],
        alice
      );
      expect(transferResult.result).toBeErr(Cl.uint(404)); // ERR-NOT-FOUND

      const approveResult = simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(highTokenId)],
        alice
      );
      expect(approveResult.result).toBeErr(Cl.uint(404)); // ERR-NOT-FOUND

      const burnResult = simnet.callPublicFn(
        "nft-token",
        "burn",
        [Cl.uint(highTokenId)],
        alice
      );
      expect(burnResult.result).toBeErr(Cl.uint(404)); // ERR-NOT-FOUND
    });

    it("should handle empty batch operations", () => {
      // Test with empty arrays
      const result = simnet.callPublicFn(
        "nft-token",
        "batch-mint",
        [
          Cl.list([]),
          Cl.list([]),
          Cl.list([]),
          Cl.list([])
        ],
        deployer
      );
      expect(result.result).toBeOk();

      // Verify no tokens were minted
      const totalSupply = simnet.callReadOnlyFn(
        "nft-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(totalSupply.result).toBeOk(Cl.uint(0));
    });

    it("should handle operations on burned tokens", () => {
      // Mint and then burn a token
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Burned Token"),
          Cl.stringAscii("Will be burned"),
          Cl.stringAscii("burned.png")
        ],
        deployer
      );

      simnet.callPublicFn(
        "nft-token",
        "burn",
        [Cl.uint(0)],
        alice
      );

      // Try to operate on burned token
      const transferResult = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(bob)],
        alice
      );
      expect(transferResult.result).toBeErr(Cl.uint(404)); // ERR-NOT-FOUND

      const approveResult = simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(0)],
        alice
      );
      expect(approveResult.result).toBeErr(Cl.uint(404)); // ERR-NOT-FOUND

      const burnAgainResult = simnet.callPublicFn(
        "nft-token",
        "burn",
        [Cl.uint(0)],
        alice
      );
      expect(burnAgainResult.result).toBeErr(Cl.uint(404)); // ERR-NOT-FOUND
    });

    it("should handle concurrent approval scenarios", () => {
      // Mint token to Alice
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Concurrent Test"),
          Cl.stringAscii("Testing concurrent approvals"),
          Cl.stringAscii("concurrent.png")
        ],
        deployer
      );

      // Alice approves Bob
      simnet.callPublicFn(
        "nft-token",
        "approve",
        [Cl.principal(bob), Cl.uint(0)],
        alice
      );

      // Alice also sets approval-for-all for Charlie
      simnet.callPublicFn(
        "nft-token",
        "set-approval-for-all",
        [Cl.principal(charlie), Cl.bool(true)],
        alice
      );

      // Both Bob and Charlie should be able to transfer
      const bobTransfer = simnet.callPublicFn(
        "nft-token",
        "transfer-from",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(bob)],
        bob
      );
      expect(bobTransfer.result).toBeOk(Cl.bool(true));

      // Charlie should no longer be able to transfer (token moved)
      const charlieTransfer = simnet.callPublicFn(
        "nft-token",
        "transfer-from",
        [Cl.uint(0), Cl.principal(bob), Cl.principal(charlie)],
        charlie
      );
      expect(charlieTransfer.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });

    it("should handle metadata edge cases", () => {
      // Test with special characters in metadata
      const specialName = "NFT with émojis 🎨";
      const specialDesc = "Description with special chars: @#$%^&*()";
      const specialImage = "https://example.com/image?param=value&other=123";

      const result = simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii(specialName),
          Cl.stringAscii(specialDesc),
          Cl.stringAscii(specialImage)
        ],
        deployer
      );
      expect(result.result).toBeOk(Cl.uint(0));

      // Verify metadata was stored correctly
      const metadataResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-token-metadata",
        [Cl.uint(0)],
        deployer
      );
      expect(metadataResult.result).toBeOk(Cl.some(Cl.tuple({
        name: Cl.stringAscii(specialName),
        description: Cl.stringAscii(specialDesc),
        image: Cl.stringAscii(specialImage)
      })));
    });

    it("should handle read-only function edge cases", () => {
      // Test read-only functions with non-existent tokens
      const ownerResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-owner",
        [Cl.uint(999)],
        deployer
      );
      expect(ownerResult.result).toBeOk(Cl.none());

      const approvedResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-approved",
        [Cl.uint(999)],
        deployer
      );
      expect(approvedResult.result).toBeOk(Cl.none());

      const metadataResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-token-metadata",
        [Cl.uint(999)],
        deployer
      );
      expect(metadataResult.result).toBeOk(Cl.none());

      const uriResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-token-uri",
        [Cl.uint(999)],
        deployer
      );
      expect(uriResult.result).toBeOk(Cl.some(Cl.stringAscii("https://predinex.com/nft/999")));

      const existsResult = simnet.callReadOnlyFn(
        "nft-token",
        "token-exists",
        [Cl.uint(999)],
        deployer
      );
      expect(existsResult.result).toBeBool(false);
    });
  });

  describe("Paid Mint Functionality", () => {
    it("should paid mint NFT successfully", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "paid-mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Paid NFT"),
          Cl.stringAscii("A paid NFT for the collection"),
          Cl.stringAscii("https://example.com/paid1.png")
        ],
        alice
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
    });

    it("should fail paid mint when exceeding max supply", () => {
      // Set max supply to 1
      simnet.callPublicFn(
        "nft-token",
        "set-max-supply",
        [Cl.uint(1)],
        deployer
      );

      // First mint should succeed
      const result1 = simnet.callPublicFn(
        "nft-token",
        "paid-mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("First NFT"),
          Cl.stringAscii("First paid NFT"),
          Cl.stringAscii("first.png")
        ],
        alice
      );
      expect(result1.result).toBeOk(Cl.uint(0));

      // Second mint should fail
      const result2 = simnet.callPublicFn(
        "nft-token",
        "paid-mint",
        [
          Cl.principal(bob),
          Cl.stringAscii("Second NFT"),
          Cl.stringAscii("Second paid NFT"),
          Cl.stringAscii("second.png")
        ],
        bob
      );
      expect(result2.result).toBeErr(Cl.uint(406)); // ERR-MINT-LIMIT-EXCEEDED
    });
  });
  describe("Whitelist Management", () => {
    it("should add minter to whitelist successfully", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "add-to-whitelist",
        [Cl.principal(alice)],
        deployer
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check if alice is whitelisted
      const whitelistResult = simnet.callReadOnlyFn(
        "nft-token",
        "is-whitelisted",
        [Cl.principal(alice)],
        deployer
      );
      expect(whitelistResult.result).toBeOk(Cl.bool(true));
    });

    it("should allow whitelisted minter to mint", () => {
      // Add alice to whitelist
      simnet.callPublicFn(
        "nft-token",
        "add-to-whitelist",
        [Cl.principal(alice)],
        deployer
      );

      // Alice should be able to mint
      const result = simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(bob),
          Cl.stringAscii("Whitelisted NFT"),
          Cl.stringAscii("Minted by whitelisted user"),
          Cl.stringAscii("whitelist.png")
        ],
        alice
      );
      expect(result.result).toBeOk(Cl.uint(0));
    });

    it("should remove minter from whitelist successfully", () => {
      // Add then remove alice
      simnet.callPublicFn(
        "nft-token",
        "add-to-whitelist",
        [Cl.principal(alice)],
        deployer
      );

      const result = simnet.callPublicFn(
        "nft-token",
        "remove-from-whitelist",
        [Cl.principal(alice)],
        deployer
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check alice is no longer whitelisted
      const whitelistResult = simnet.callReadOnlyFn(
        "nft-token",
        "is-whitelisted",
        [Cl.principal(alice)],
        deployer
      );
      expect(whitelistResult.result).toBeOk(Cl.bool(false));
    });
  });
  describe("Royalty Management", () => {
    beforeEach(() => {
      // Mint a token for royalty tests
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Royalty NFT"),
          Cl.stringAscii("NFT with royalties"),
          Cl.stringAscii("royalty.png")
        ],
        deployer
      );
    });

    it("should set token royalty successfully", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "set-token-royalty",
        [Cl.uint(0), Cl.principal(alice), Cl.uint(500)], // 5% royalty
        deployer
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check royalty info
      const royaltyResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-token-royalty",
        [Cl.uint(0)],
        deployer
      );
      expect(royaltyResult.result).toBeOk(Cl.some(Cl.tuple({
        recipient: Cl.principal(alice),
        percentage: Cl.uint(500)
      })));
    });

    it("should fail to set royalty above maximum", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "set-token-royalty",
        [Cl.uint(0), Cl.principal(alice), Cl.uint(1500)], // 15% royalty (too high)
        deployer
      );
      expect(result.result).toBeErr(Cl.uint(400)); // ERR-INVALID-TOKEN-ID
    });

    it("should fail to set royalty from non-owner", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "set-token-royalty",
        [Cl.uint(0), Cl.principal(alice), Cl.uint(500)],
        alice // Non-contract-owner
      );
      expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });
  });
  describe("Metadata Freezing", () => {
    beforeEach(() => {
      // Mint a token for metadata tests
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Metadata NFT"),
          Cl.stringAscii("NFT for metadata testing"),
          Cl.stringAscii("metadata.png")
        ],
        deployer
      );
    });

    it("should update metadata when not frozen", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "update-token-metadata",
        [
          Cl.uint(0),
          Cl.stringAscii("Updated NFT"),
          Cl.stringAscii("Updated description"),
          Cl.stringAscii("updated.png")
        ],
        alice
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check updated metadata
      const metadataResult = simnet.callReadOnlyFn(
        "nft-token",
        "get-token-metadata",
        [Cl.uint(0)],
        deployer
      );
      expect(metadataResult.result).toBeOk(Cl.some(Cl.tuple({
        name: Cl.stringAscii("Updated NFT"),
        description: Cl.stringAscii("Updated description"),
        image: Cl.stringAscii("updated.png")
      })));
    });

    it("should freeze metadata successfully", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "freeze-metadata",
        [Cl.uint(0)],
        alice
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check if metadata is frozen
      const frozenResult = simnet.callReadOnlyFn(
        "nft-token",
        "is-metadata-frozen",
        [Cl.uint(0)],
        deployer
      );
      expect(frozenResult.result).toBeOk(Cl.bool(true));
    });

    it("should fail to update frozen metadata", () => {
      // First freeze the metadata
      simnet.callPublicFn(
        "nft-token",
        "freeze-metadata",
        [Cl.uint(0)],
        alice
      );

      // Try to update frozen metadata
      const result = simnet.callPublicFn(
        "nft-token",
        "update-token-metadata",
        [
          Cl.uint(0),
          Cl.stringAscii("Should Fail"),
          Cl.stringAscii("This should not work"),
          Cl.stringAscii("fail.png")
        ],
        alice
      );
      expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });
  });
  describe("Contract Pause Functionality", () => {
    it("should pause contract successfully", () => {
      const result = simnet.callPublicFn(
        "nft-token",
        "pause-contract",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check if contract is paused
      const pausedResult = simnet.callReadOnlyFn(
        "nft-token",
        "is-paused",
        [],
        deployer
      );
      expect(pausedResult.result).toBeOk(Cl.bool(true));
    });

    it("should unpause contract successfully", () => {
      // First pause
      simnet.callPublicFn(
        "nft-token",
        "pause-contract",
        [],
        deployer
      );

      // Then unpause
      const result = simnet.callPublicFn(
        "nft-token",
        "unpause-contract",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.bool(true));

      // Check if contract is unpaused
      const pausedResult = simnet.callReadOnlyFn(
        "nft-token",
        "is-paused",
        [],
        deployer
      );
      expect(pausedResult.result).toBeOk(Cl.bool(false));
    });

    it("should prevent transfers when paused", () => {
      // Mint a token first
      simnet.callPublicFn(
        "nft-token",
        "mint",
        [
          Cl.principal(alice),
          Cl.stringAscii("Pause Test NFT"),
          Cl.stringAscii("Testing pause functionality"),
          Cl.stringAscii("pause.png")
        ],
        deployer
      );

      // Pause the contract
      simnet.callPublicFn(
        "nft-token",
        "pause-contract",
        [],
        deployer
      );

      // Try to transfer (should fail)
      const result = simnet.callPublicFn(
        "nft-token",
        "transfer",
        [Cl.uint(0), Cl.principal(alice), Cl.principal(bob)],
        alice
      );
      expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
    });
  });