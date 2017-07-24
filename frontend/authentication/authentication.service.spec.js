describe('Authentication', () => {
  beforeEach(module('authentication'));

  beforeEach(inject(function(_Authentication_) {
    Authentication = _Authentication_;
  }));

  it('should set and report authentication status', function() {
    expect(Authentication.isAdmin).toBe(false);
    Authentication.isAdmin = true;
    expect(Authentication.isAdmin).toBe(true);
  });
});
