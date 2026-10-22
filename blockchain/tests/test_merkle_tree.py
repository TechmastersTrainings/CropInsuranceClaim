import pytest
from blockchain.client.gateway import MerkleTree, compute_sha256


def test_merkle_tree_empty_and_single():
    root_empty = MerkleTree.compute_root([])
    assert len(root_empty) == 64

    root_single = MerkleTree.compute_root(["reading_1"])
    assert root_single == compute_sha256("reading_1")


def test_merkle_tree_deterministic():
    leaves = ["frame_a", "frame_b", "frame_c", "frame_d"]
    root1 = MerkleTree.compute_root(leaves)
    root2 = MerkleTree.compute_root(leaves)
    assert root1 == root2
    assert len(root1) == 64


def test_merkle_tree_tamper_detection():
    leaves = ["sensor_1:30.5", "sensor_2:31.0", "sensor_3:30.8"]
    original_root = MerkleTree.compute_root(leaves)

    # Tamper with one sensor reading
    tampered_leaves = ["sensor_1:30.5", "sensor_2:31.1", "sensor_3:30.8"]
    tampered_root = MerkleTree.compute_root(tampered_leaves)

    assert original_root != tampered_root
